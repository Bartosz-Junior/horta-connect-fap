// Lógica Geral do Painel, Mapa Interativo e Chatbot - HortaConecta

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. VALIDAÇÃO DE AUTENTICAÇÃO E INFORMAÇÕES DE SESSÃO
  // ==========================================================================
  const currentUser = HortaDb.getCurrentUser();
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // Preencher informações do perfil logado na barra lateral
  document.getElementById('user-name').innerText = currentUser.name;
  document.getElementById('user-profile').innerText = `Perfil: ${currentUser.profile}`;
  document.getElementById('user-avatar').innerText = currentUser.name.charAt(0).toUpperCase();

  // Evento de Logout
  document.getElementById('logout-button').addEventListener('click', () => {
    HortaDb.logout();
    window.location.href = 'login.html';
  });

  // ==========================================================================
  // 2. SISTEMA DE ROTAS / NAVEGAÇÃO SPA
  // ==========================================================================
  const menuItems = document.querySelectorAll('.sidebar-menu .menu-item[data-view]');
  const viewSections = document.querySelectorAll('.view-section');
  const viewTitle = document.getElementById('view-title');
  const viewSubtitle = document.getElementById('view-subtitle');

  const viewMetadata = {
    mapa: {
      title: 'Mapeamento Inteligente',
      subtitle: 'Explore terrenos ociosos disponíveis para cultivo urbano e rural.'
    },
    plantio: {
      title: 'Guia Interativo de Plantio',
      subtitle: 'Biblioteca agroecológica e dicas de manejo ecológico para canteiros.'
    },
    calendario: {
      title: 'Calendário e Ações Comunitárias',
      subtitle: 'Acompanhe as tarefas coletivas de irrigação, plantio e colheitas.'
    },
    insumos: {
      title: 'Banco de Insumos',
      subtitle: 'Economia compartilhada de ferramentas, adubos, sementes e mudas.'
    },
    marketplace: {
      title: 'Marketplace C2B & Doações',
      subtitle: 'Alimentos excedentes da comunidade disponíveis para partilha ou preço social.'
    }
  };

  // Função para ativar uma view específica
  function switchView(viewName) {
    if (!viewMetadata[viewName]) return;

    // Remove active dos menus
    menuItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Alternar visibilidade das seções
    viewSections.forEach(section => {
      if (section.id === `view-${viewName}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Atualizar títulos do cabeçalho
    viewTitle.innerText = viewMetadata[viewName].title;
    viewSubtitle.innerText = viewMetadata[viewName].subtitle;

    // Fechar popover do mapa se mudar de tela
    closePopover();

    // Relaunch rendering baseados no conteúdo da view
    if (viewName === 'mapa') {
      renderLands(HortaDb.getLands());
    } else if (viewName === 'plantio') {
      renderPlants(HortaDb.getPlantingGuide());
    } else if (viewName === 'calendario') {
      renderEvents(HortaDb.getEvents());
    } else if (viewName === 'insumos') {
      renderInputs(HortaDb.getInputs());
    } else if (viewName === 'marketplace') {
      renderProducts(HortaDb.getProducts());
    }
  }

  // Evento de clique nos menus da sidebar
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const viewName = item.getAttribute('data-view');
      switchView(viewName);
    });
  });

  // Roteamento baseado no Hash da URL (para deep linking de links externos)
  function handleHashRoute() {
    const hash = window.location.hash.replace('#', '');
    if (hash && viewMetadata[hash]) {
      switchView(hash);
    } else {
      switchView('mapa'); // Rota padrão
    }
  }

  window.addEventListener('hashchange', handleHashRoute);
  handleHashRoute(); // Executar na carga inicial da página

  // ==========================================================================
  // 3. SEÇÃO: FILTROS E BUSCA DE TERRENOS + MAPA SIMULADO
  // ==========================================================================
  const searchInput = document.getElementById('search-input');
  const filterSun = document.getElementById('filter-sun');
  const filterWater = document.getElementById('filter-water');
  const filterSize = document.getElementById('filter-size');
  
  const landsList = document.getElementById('lands-list');
  const mapCanvas = document.getElementById('map-canvas');
  const landPopover = document.getElementById('land-popover');

  // Adicionar escuta de eventos nos filtros
  [searchInput, filterSun, filterWater, filterSize].forEach(element => {
    if (element) {
      element.addEventListener('input', applyLandsFilters);
    }
  });

  function applyLandsFilters() {
    const query = searchInput.value.toLowerCase();
    const sunValue = filterSun.value;
    const waterValue = filterWater.value;
    const sizeValue = parseInt(filterSize.value);

    const filtered = HortaDb.getLands().filter(land => {
      const matchesSearch = land.title.toLowerCase().includes(query) || land.address.toLowerCase().includes(query);
      const matchesSun = sunValue === "" || land.sun === sunValue;
      const matchesWater = waterValue === "" || land.water === waterValue;
      const matchesSize = land.size >= sizeValue;

      return matchesSearch && matchesSun && matchesWater && matchesSize;
    });

    renderLands(filtered);
    closePopover();
  }

  // Renderiza a lista lateral e os alfinetes do mapa
  function renderLands(landsToRender) {
    // 1. Renderizar lista lateral
    landsList.innerHTML = '';
    
    if (landsToRender.length === 0) {
      landsList.innerHTML = `
        <div style="text-align: center; color: var(--text-light); padding: 20px; font-size: 0.85rem;">
          Nenhum terreno corresponde aos filtros aplicados.
        </div>
      `;
    } else {
      landsToRender.forEach(land => {
        const card = document.createElement('div');
        card.className = 'land-list-card';
        card.setAttribute('data-id', land.id);
        card.innerHTML = `
          <h4>${land.title}</h4>
          <p>${land.address}</p>
          <div class="land-list-meta">
            <span class="badge badge-primary">${land.size} m²</span>
            <span class="badge badge-warning"><i class="fa-solid fa-sun"></i> Sol: ${land.sun}</span>
          </div>
        `;
        
        card.addEventListener('click', () => {
          // Destacar card lateral
          document.querySelectorAll('.land-list-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          
          // Destacar e centralizar pino no mapa
          const pin = document.querySelector(`.map-pin[data-id="${land.id}"]`);
          if (pin) {
            document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
            pin.classList.add('active');
            openLandPopover(land, pin);
          }
        });
        
        landsList.appendChild(card);
      });
    }

    // 2. Renderizar Pins no Mapa
    // Remover pinos antigos mantendo apenas o rio, parque e popover
    const oldPins = mapCanvas.querySelectorAll('.map-pin');
    oldPins.forEach(p => p.remove());

    landsToRender.forEach(land => {
      const pin = document.createElement('div');
      pin.className = 'map-pin';
      pin.setAttribute('data-id', land.id);
      pin.style.left = `${land.x}%`;
      pin.style.top = `${land.y}%`;
      pin.innerHTML = `<i class="fa-solid fa-seedling"></i>`;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        
        document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
        pin.classList.add('active');

        // Destacar na lista lateral
        document.querySelectorAll('.land-list-card').forEach(c => c.classList.remove('active'));
        const activeCard = document.querySelector(`.land-list-card[data-id="${land.id}"]`);
        if (activeCard) {
          activeCard.classList.add('active');
          activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        openLandPopover(land, pin);
      });

      mapCanvas.appendChild(pin);
    });
  }

  // Abrir Balão de Detalhes no Mapa
  function openLandPopover(land, pinElement) {
    landPopover.innerHTML = `
      <img src="${land.image}" alt="${land.title}" class="popover-image">
      <h4>${land.title}</h4>
      <p style="font-weight: 500; font-size: 0.7rem; color: var(--primary); margin-bottom: 4px;">
        <i class="fa-solid fa-user"></i> Proprietário: ${land.owner}
      </p>
      <p style="font-size: 0.7rem; margin-bottom: 8px;">${land.address}</p>
      
      <div class="popover-features">
        <span class="badge badge-primary">${land.size} m²</span>
        <span class="badge ${land.water === 'Sim' ? 'badge-success' : 'badge-danger'}">
          <i class="fa-solid fa-droplet"></i> Água: ${land.water}
        </span>
        <span class="badge badge-warning">
          <i class="fa-solid fa-sun"></i> Sol: ${land.sun}
        </span>
      </div>

      <div style="font-size: 0.72rem; color: var(--text-light); background: var(--bg-main); padding: 8px; border-radius: var(--radius-sm); margin-bottom: 12px; max-height: 55px; overflow-y: auto;">
        <strong>Histórico do Solo:</strong> ${land.soil}
      </div>

      <button class="btn-primary" id="btn-interest-land" style="width: 100%; justify-content: center; font-size: 0.8rem; padding: 8px 12px;">
        Manifestar Interesse <i class="fa-solid fa-envelope"></i>
      </button>
    `;

    // Posicionar Popover relativo ao pino
    landPopover.style.left = `${land.x}%`;
    landPopover.style.top = `${land.y - 12}%`; // Posiciona logo acima
    landPopover.style.display = 'block';

    // Ação do Botão Manifestar Interesse
    document.getElementById('btn-interest-land').addEventListener('click', () => {
      showActionModal(
        'Contato de Parceria Iniciado! 📩',
        `Uma notificação de interesse foi enviada para o proprietário **${land.owner}** (${land.contact}). Você receberá uma cópia dos detalhes do terreno e do perfil da sua instituição no seu e-mail de cadastro para iniciar os diálogos de parceria agroecológica.`
      );
    });
  }

  function closePopover() {
    landPopover.style.display = 'none';
  }

  // Fechar popover ao clicar fora no mapa
  mapCanvas.addEventListener('click', (e) => {
    if (e.target === mapCanvas) {
      closePopover();
      document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.land-list-card').forEach(c => c.classList.remove('active'));
    }
  });

  // ==========================================================================
  // 4. SEÇÃO: GUIA DE PLANTIO (ENCICLOPÉDIA ECO)
  // ==========================================================================
  const plantsContainer = document.getElementById('plants-container');
  const catButtons = document.querySelectorAll('[data-cat]');

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('btn-active-category', 'btn-primary'));
      catButtons.forEach(b => b.classList.add('btn-outline'));
      
      btn.classList.remove('btn-outline');
      btn.classList.add('btn-active-category', 'btn-primary');

      const category = btn.getAttribute('data-cat');
      const plants = HortaDb.getPlantingGuide();

      if (category === 'all') {
        renderPlants(plants);
      } else {
        const filtered = plants.filter(p => p.category.includes(category));
        renderPlants(filtered);
      }
    });
  });

  function renderPlants(plantsToRender) {
    if (!plantsContainer) return;
    plantsContainer.innerHTML = '';

    plantsToRender.forEach(plant => {
      const card = document.createElement('div');
      card.className = 'plant-card';
      card.innerHTML = `
        <div class="plant-card-header">
          <div class="plant-emoji">${plant.icon}</div>
          <span class="badge badge-primary">${plant.category}</span>
        </div>
        <div class="plant-title">
          <h3>${plant.name}</h3>
          <span>Época: ${plant.season}</span>
        </div>
        <div class="plant-details">
          <div><strong>Plantas Companheiras:</strong> <span>${plant.companions}</span></div>
          <div><strong>Nível Dificuldade:</strong> <span style="color: ${plant.difficulty === 'Fácil' ? 'var(--success)' : 'var(--warning)'};">${plant.difficulty}</span></div>
          <div><strong>Regas:</strong> <span>${plant.watering}</span></div>
        </div>
        <p><i class="fa-regular fa-lightbulb"></i> ${plant.tips}</p>
      `;
      plantsContainer.appendChild(card);
    });
  }

  // ==========================================================================
  // 5. SEÇÃO: CALENDÁRIO COMUNITÁRIO
  // ==========================================================================
  const eventsTimeline = document.getElementById('events-timeline');

  function renderEvents(eventsToRender) {
    if (!eventsTimeline) return;
    eventsTimeline.innerHTML = '';

    // Ordenar por data
    eventsToRender.sort((a, b) => new Date(a.date) - new Date(b.date));

    eventsToRender.forEach(evt => {
      const dateParts = evt.date.split('-');
      const day = dateParts[2];
      const monthStr = dateParts[1] === '06' ? 'JUN' : 'OUT';

      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-marker">${day}</div>
        <div class="timeline-content">
          <h3>${evt.title} <span class="badge ${getEventBadgeClass(evt.category)}">${evt.category}</span></h3>
          <p class="meta">
            <span><i class="fa-regular fa-clock"></i> ${evt.time}</span>
            <span><i class="fa-solid fa-location-dot"></i> ${evt.location}</span>
          </p>
          <p class="desc">${evt.description}</p>
        </div>
      `;
      eventsTimeline.appendChild(item);
    });
  }

  function getEventBadgeClass(category) {
    switch(category) {
      case 'Mutirão': return 'badge-primary';
      case 'Plantio': return 'badge-success';
      case 'Oficina': return 'badge-warning';
      case 'Colheita': return 'badge-danger';
      default: return 'badge-primary';
    }
  }

  // ==========================================================================
  // 6. SEÇÃO: BANCO DE INSUMOS (ECONOMIA COMPARTILHADA)
  // ==========================================================================
  const inputsContainer = document.getElementById('inputs-container');
  const btnAddInsumo = document.getElementById('btn-add-insumo');

  function renderInputs(inputsToRender) {
    if (!inputsContainer) return;
    inputsContainer.innerHTML = '';

    inputsToRender.forEach(item => {
      const card = document.createElement('div');
      card.className = 'input-card';
      card.innerHTML = `
        <div class="input-card-header">
          <span class="badge ${item.type === 'Doação' ? 'badge-success' : 'badge-warning'}">${item.type}</span>
          <span style="font-size: 0.75rem; color: var(--text-light);"><i class="fa-solid fa-tag"></i> ${item.category}</span>
        </div>
        <h3>${item.title}</h3>
        <p class="desc">${item.description}</p>
        
        <div class="input-card-meta">
          <div><strong>Ofertante:</strong> ${item.owner}</div>
          <div><strong>Local:</strong> ${item.location}</div>
        </div>

        <button class="btn-primary btn-claim-input" data-id="${item.id}" style="width: 100%; justify-content: center; font-size: 0.85rem; padding: 8px 12px; margin-top: 10px;">
          ${item.type === 'Doação' ? 'Solicitar Doação' : 'Pegar Emprestado'}
        </button>
      `;

      // Evento de resgate do insumo
      card.querySelector('.btn-claim-input').addEventListener('click', () => {
        showActionModal(
          'Solicitação de Insumo Efetuada! 🛠️',
          `Sua solicitação para **"${item.title}"** foi enviada a **${item.owner}**. Um e-mail com as informações de contato foi gerado para que vocês possam combinar a data e o local de retirada/devolução do item.`
        );
      });

      inputsContainer.appendChild(card);
    });
  }

  // Simulação interativa para Oferecer Novo Insumo
  if (btnAddInsumo) {
    btnAddInsumo.addEventListener('click', () => {
      const title = prompt("Digite o nome do insumo / ferramenta:");
      if (!title) return;
      const type = confirm("O item é para DOAÇÃO definitiva? (Selecione OK para 'Doação' ou Cancelar para 'Empréstimo')") ? 'Doação' : 'Empréstimo';
      const category = prompt("Digite a categoria do insumo (Ferramentas, Mudas, Adubos, Sementes):", "Ferramentas");
      if (!category) return;
      const description = prompt("Insira uma breve descrição do item:");
      if (!description) return;

      const newInsumo = {
        id: HortaDb.getInputs().length + 1,
        title,
        owner: currentUser.name,
        category,
        type,
        description,
        location: `${currentUser.city}, ${currentUser.state}`,
        status: 'Disponível'
      };

      HortaDb.saveInput(newInsumo);
      renderInputs(HortaDb.getInputs());
      
      showActionModal(
        'Insumo Cadastrado na Rede!',
        'Seu item já está visível para compartilhamento. Cooperativas e agricultores urbanos da sua região agora podem solicitar o empréstimo/doação.'
      );
    });
  }

  // ==========================================================================
  // 7. SEÇÃO: MARKETPLACE C2B & DOAÇÕES
  // ==========================================================================
  const productsContainer = document.getElementById('products-container');
  const btnAddProduct = document.getElementById('btn-add-product');

  function renderProducts(productsToRender) {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';

    productsToRender.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-image-container">
          <img src="${prod.image}" alt="${prod.title}">
          <span class="badge ${prod.badge === 'Doação' ? 'badge-success' : 'badge-warning'} product-badge">
            ${prod.badge}
          </span>
        </div>
        <div class="product-content">
          <h3>${prod.title}</h3>
          <p class="desc">${prod.description}</p>
          <div class="product-footer">
            <span class="product-price">
              ${prod.price ? `R$ ${prod.price.toFixed(2)}` : 'Grátis (Doação)'}
            </span>
            <span class="product-stock">${prod.stock}</span>
          </div>
          <button class="btn-primary btn-order-product" style="width: 100%; justify-content: center; font-size: 0.85rem; padding: 8px 12px; margin-top: 10px;">
            ${prod.badge === 'Doação' ? 'Solicitar Alimento' : 'Comprar Alimento'}
          </button>
        </div>
      `;

      card.querySelector('.btn-order-product').addEventListener('click', () => {
        showActionModal(
          prod.badge === 'Doação' ? 'Reserva Realizada com Sucesso! 🍎' : 'Pedido Confirmado! 🛒',
          prod.badge === 'Doação' 
            ? `O alimento foi reservado para você. Por favor, compareça à horta local produtora para retirada do mantimento gratuito.`
            : `Sua compra de **"${prod.title}"** no valor social de **R$ ${prod.price.toFixed(2)}** foi processada ficticiamente. Combine a entrega e o pagamento no local da horta comunitária.`
        );
      });

      productsContainer.appendChild(card);
    });
  }

  // Anunciar excedente interativo
  if (btnAddProduct) {
    btnAddProduct.addEventListener('click', () => {
      const title = prompt("Digite o nome do produto excedente:");
      if (!title) return;
      const isDonation = confirm("Este produto é para doação livre? (OK para Doar / Cancelar para Preço Social)");
      let price = null;
      let badge = 'Doação';
      
      if (!isDonation) {
        price = parseFloat(prompt("Digite o preço social (R$):", "5.00"));
        if (isNaN(price)) return;
        badge = 'Preço Social';
      }

      const description = prompt("Descreva o produto:");
      if (!description) return;

      const newProduct = {
        id: HortaDb.getProducts().length + 1,
        title,
        category: 'Hortaliças',
        price,
        badge,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop',
        stock: 'Disponível sob consulta',
        description
      };

      HortaDb.saveProduct(newProduct);
      renderProducts(HortaDb.getProducts());

      showActionModal(
        'Anúncio do Alimento Ativo!',
        'Seu excedente de alimentos foi publicado. Ele já está visível para famílias e pequenos compradores solidários.'
      );
    });
  }

  // ==========================================================================
  // 8. CHATBOT FLUTUANTE DE SUPORTE
  // ==========================================================================
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const chatContainer = document.getElementById('chatbot-container');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatChips = document.querySelectorAll('.chat-chip');

  // Abrir e fechar chatbot
  chatToggleBtn.addEventListener('click', () => {
    chatContainer.classList.toggle('open');
    if (chatContainer.classList.contains('open')) {
      chatInput.focus();
    }
  });

  // Enviar Mensagem do Usuário
  function sendMessage(text) {
    if (!text.trim()) return;

    // Criar bolha de mensagem do usuário
    appendMessage(text, 'user');
    chatInput.value = '';

    // Efeito de bot "digitando..."
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble bot typing-bubble';
    typingBubble.innerHTML = '<i class="fa-solid fa-ellipsis fa-bounce"></i>';
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Atraso artificial de resposta para ficar premium
    setTimeout(() => {
      typingBubble.remove();
      const botResponse = HortaDb.getChatbotResponse(text);
      appendMessage(botResponse, 'bot');
    }, 600);
  }

  // Adiciona a bolha de mensagem formatada
  function appendMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    
    // Suportar formatação markdown básica no chatbot para ficar premium
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    bubble.innerHTML = formattedText;
    chatMessages.appendChild(bubble);
    
    // Scroll suave para o final
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Envio clássico com teclado Enter
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage(chatInput.value);
    }
  });

  // Envio ao clicar no botão
  chatSendBtn.addEventListener('click', () => {
    sendMessage(chatInput.value);
  });

  // Chips de atalho rápido
  chatChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      sendMessage(query);
    });
  });

  // ==========================================================================
  // 9. MODAL GERAL DE SOLICITAÇÕES E FEEDBACK
  // ==========================================================================
  const actionModal = document.getElementById('action-modal');
  const actionTitle = document.getElementById('action-modal-title');
  const actionDesc = document.getElementById('action-modal-desc');
  const btnCloseActionModal = document.getElementById('btn-close-action-modal');

  function showActionModal(title, description) {
    actionTitle.innerText = title;
    actionDesc.innerHTML = description;
    actionModal.style.display = 'flex';
  }

  if (btnCloseActionModal) {
    btnCloseActionModal.addEventListener('click', () => {
      actionModal.style.display = 'none';
    });
  }

  // Fechar modal ao clicar fora
  actionModal.addEventListener('click', (e) => {
    if (e.target === actionModal) {
      actionModal.style.display = 'none';
    }
  });

});
