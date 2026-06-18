// Banco de Dados Simulado (JSON Mocks) para o projeto HortaConecta

// Chaves do localStorage para manter os estados dinâmicos
const STORAGE_KEYS = {
  USERS: 'hortaconecta_users',
  LANDS: 'hortaconecta_lands',
  CURRENT_USER: 'hortaconecta_current_user',
  INPUTS: 'hortaconecta_inputs',
  PRODUCTS: 'hortaconecta_products',
  EVENTS: 'hortaconecta_events'
};

// 1. Usuários Padrão
const defaultUsers = [
  {
    email: 'contato@hortaconecta.org',
    password: 'senha123',
    name: 'ONG Horta Feliz',
    profile: 'ONG',
    city: 'São Paulo',
    state: 'SP'
  },
  {
    email: 'ana.terra@gmail.com',
    password: 'senha123',
    name: 'Ana Terra (Proprietária)',
    profile: 'Sociedade Civil',
    city: 'Curitiba',
    state: 'PR'
  },
  {
    email: 'escola.verde@edu.br',
    password: 'senha123',
    name: 'Escola Municipal Primavera',
    profile: 'Escola',
    city: 'Belo Horizonte',
    state: 'MG'
  }
];

// 2. Terrenos Iniciais
const defaultLands = [
  {
    id: 1,
    title: 'Terreno Solar Santana',
    address: 'Rua Voluntários da Pátria, 1200 - Santana, São Paulo - SP',
    size: 250,
    sun: 'Alta', // Alta, Média, Baixa
    water: 'Sim', // Sim, Não
    soil: 'Terra preta argilosa, anteriormente usada para gramado residencial. PH neutro.',
    owner: 'Ana Terra',
    contact: 'ana.terra@gmail.com',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop',
    x: 45, // Posição X percentual no mapa simulado
    y: 35  // Posição Y percentual no mapa simulado
  },
  {
    id: 2,
    title: 'Área Verde Vila Mariana',
    address: 'Av. Lins de Vasconcelos, 3400 - Vila Mariana, São Paulo - SP',
    size: 500,
    sun: 'Média',
    water: 'Sim',
    soil: 'Solo arenoso com algumas pedras, limpo de detritos. Necessita de adição de matéria orgânica.',
    owner: 'Carlos Silva',
    contact: 'carlos.silva@terra.com',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=600&auto=format&fit=crop',
    x: 58,
    y: 62
  },
  {
    id: 3,
    title: 'Quintal Comunitário Butantã',
    address: 'Rua Alvarenga, 850 - Butantã, São Paulo - SP',
    size: 120,
    sun: 'Baixa',
    water: 'Não',
    soil: 'Solo bem compactado, requer aeração e aração profunda. Ótimo acesso urbano.',
    owner: 'Roberto Mendonça',
    contact: 'roberto.m@gmail.com',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=600&auto=format&fit=crop',
    x: 25,
    y: 50
  },
  {
    id: 4,
    title: 'Loteamento Solar Leste',
    address: 'Rua Itaquera, 105 - Itaquera, São Paulo - SP',
    size: 800,
    sun: 'Alta',
    water: 'Sim',
    soil: 'Antiga área de pastagem, terra fértil e sem contaminações detectadas.',
    owner: 'Construtora EcoLar',
    contact: 'esg@ecolar.com.br',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=600&auto=format&fit=crop',
    x: 82,
    y: 40
  }
];

// 3. Guia de Plantio (Sementes e Plantas Companheiras)
const plantingGuide = [
  {
    id: 'tomate',
    name: 'Tomate Cereja',
    category: 'Frutos',
    season: 'Primavera/Verão',
    companions: 'Manjericão, Cenoura, Calêndula',
    difficulty: 'Média',
    watering: 'Frequente (3-4x por semana)',
    tips: 'Necessita de tutoramento (estacas) para não tombar. O manjericão ao lado afasta pragas e melhora o sabor.',
    icon: '🍅'
  },
  {
    id: 'alface',
    name: 'Alface Crespa',
    category: 'Folhas',
    season: 'Ano Todo (Evitar calor extremo)',
    companions: 'Rabanete, Cenoura, Cebola',
    difficulty: 'Fácil',
    watering: 'Moderada (Diária nas primeiras semanas)',
    tips: 'Ideal para iniciantes. Gosta de sol matinal e solo sempre úmido, mas nunca encharcado.',
    icon: '🥬'
  },
  {
    id: 'cenoura',
    name: 'Cenoura',
    category: 'Raízes',
    season: 'Ano Todo',
    companions: 'Alface, Alecrim, Tomate',
    difficulty: 'Média',
    watering: 'Regular (2-3x por semana)',
    tips: 'Requer solo bem fofo, arenoso e sem pedras para crescer reta. Evite excesso de nitrogênio para não bifurcar.',
    icon: '🥕'
  },
  {
    id: 'manjericao',
    name: 'Manjericão',
    category: 'Ervas/Aromáticas',
    season: 'Primavera/Verão',
    companions: 'Tomate, Pimentão, Abobrinha',
    difficulty: 'Fácil',
    watering: 'Regular (Evitar molhar as folhas)',
    tips: 'Gosta de bastante sol (mínimo 4h diárias). Faça a poda das flores para prolongar a vida das folhas.',
    icon: '🌿'
  },
  {
    id: 'calendula',
    name: 'Calêndula',
    category: 'Flores Comestíveis',
    season: 'Outono/Inverno',
    companions: 'Tomate, Alface, Repolho',
    difficulty: 'Fácil',
    watering: 'Moderada (2x por semana)',
    tips: 'Excelente planta repelente natural de pragas e atrativa para polinizadores como abelhas e joaninhas.',
    icon: '🌼'
  },
  {
    id: 'abobrinha',
    name: 'Abobrinha Italiana',
    category: 'Frutos',
    season: 'Primavera/Verão',
    companions: 'Milho, Feijão (Associação ODS 2)',
    difficulty: 'Média',
    watering: 'Frequente (Solo sempre úmido)',
    tips: 'Necessita de bastante espaço físico. As flores amarelas também são comestíveis e deliciosas.',
    icon: '🥒'
  }
];

// 4. Calendário Inteligente de Atividades
const defaultEvents = [
  {
    id: 1,
    date: '2026-06-20',
    title: 'Mutirão de Preparação de Canteiros',
    time: '08:30 - 12:00',
    location: 'Terreno Solar Santana',
    category: 'Mutirão',
    description: 'Dia de ajeitar a terra, misturar adubo orgânico e delimitar os canteiros para as novas mudas de hortaliças.'
  },
  {
    id: 2,
    date: '2026-06-22',
    title: 'Plantio Coletivo de Inverno',
    time: '14:00 - 16:30',
    location: 'Quintal Comunitário Butantã',
    category: 'Plantio',
    description: 'Semeadura direta de cenoura e rabanete e transplante de mudas de alface crespa e rúcula.'
  },
  {
    id: 3,
    date: '2026-06-25',
    title: 'Oficina de Compostagem Doméstica',
    time: '09:00 - 11:00',
    location: 'Área Verde Vila Mariana',
    category: 'Oficina',
    description: 'Aprenda a transformar cascas de vegetais da sua cozinha em adubo de altíssima qualidade para a horta.'
  },
  {
    id: 4,
    date: '2026-06-28',
    title: 'Primeiro Mutirão de Colheita e Partilha',
    time: '08:00 - 10:30',
    location: 'Loteamento Solar Leste',
    category: 'Colheita',
    description: 'Colheita conjunta das folhosas e distribuição gratuita de excedentes para as famílias cadastradas na comunidade.'
  }
];

// 5. Banco de Insumos (Economia Compartilhada)
const defaultInputs = [
  {
    id: 1,
    title: 'Enxadas e Rastelos para Empréstimo',
    owner: 'ONG Horta Feliz',
    category: 'Ferramentas',
    type: 'Empréstimo',
    description: 'Temos 3 enxadas e 2 rastelos de ferro disponíveis para empréstimo de até 5 dias para novos projetos locais.',
    location: 'Santana, São Paulo - SP',
    status: 'Disponível'
  },
  {
    id: 2,
    title: '50 Mudas de Manjericão Roxo',
    owner: 'Horto Municipal',
    category: 'Mudas',
    type: 'Doação',
    description: 'Mudas bem enraizadas prontas para plantio imediato. Retirar na recepção do parque.',
    location: 'Parque Ibirapuera, São Paulo - SP',
    status: 'Disponível'
  },
  {
    id: 3,
    title: 'Sacos de Húmus de Minhoca Orgânico',
    owner: 'Carlos Silva',
    category: 'Adubos',
    type: 'Doação',
    description: 'Produção excedente da minha composteira doméstica. 4 sacos de 5kg disponíveis para retirada.',
    location: 'Vila Mariana, São Paulo - SP',
    status: 'Disponível'
  },
  {
    id: 4,
    title: 'Sementes Orgânicas de Coentro e Salsa',
    owner: 'Clube de Jardinagem',
    category: 'Sementes',
    type: 'Doação',
    description: 'Sementes crioulas colhidas na última estação, alta taxa de germinação (mais de 85%).',
    location: 'Pinheiros, São Paulo - SP',
    status: 'Disponível'
  }
];

// 6. Marketplace C2B e Doações
const defaultProducts = [
  {
    id: 1,
    title: 'Cesta Orgânica Padrão (3kg)',
    category: 'Legumes e Folhas',
    price: 15.00, // Preço Social
    badge: 'Preço Social', // Preço Social ou Doação
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop',
    stock: '5 unidades disponíveis',
    description: 'Contém: 1 pé de alface crespa, 1 maço de rúcula, 1kg de tomate cereja, 500g de cenoura e 500g de vagem.'
  },
  {
    id: 2,
    title: 'Excedente de Banana Prata (Penca)',
    category: 'Frutas',
    price: null,
    badge: 'Doação',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=600&auto=format&fit=crop',
    stock: '3 pencas disponíveis',
    description: 'Bananas maduras da nossa horta urbana do Butantã. Excelentes para consumo imediato ou doces.'
  },
  {
    id: 3,
    title: 'Maço de Alecrim Fresco',
    category: 'Ervas',
    price: null,
    badge: 'Doação',
    image: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?q=80&w=600&auto=format&fit=crop',
    stock: '10 maços disponíveis',
    description: 'Alecrim colhido na hora, muito aromático e perfeito para tempero ou chás.'
  },
  {
    id: 4,
    title: 'Adubo Orgânico de Composteira (5kg)',
    category: 'Insumos',
    price: 8.00,
    badge: 'Preço Social',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=600&auto=format&fit=crop',
    stock: '6 sacos disponíveis',
    description: 'Adubo premium estabilizado e peneirado, rico em nutrientes para hortaliças e flores.'
  }
];

// 7. Base de Respostas Automatizadas do Chatbot
const chatbotResponses = {
  cumprimento: [
    "Olá! Sou o **HortaBot**, seu assistente agroecológico virtual. Como posso te ajudar hoje no HortaConecta? 🌱",
    "Olá, entusiasta da sustentabilidade! Sou o HortaBot. O que você gostaria de saber sobre plantio, solos ou nossa plataforma hoje? 💚"
  ],
  despedida: [
    "Até mais! Continue conectando e cultivando um mundo melhor! Se precisar, estarei por aqui. 🌍",
    "Tchau! Que suas colheitas sejam fartas e ecológicas! 👋"
  ],
  duvidas_gerais: {
    solos: "Para preparar o solo da sua horta, misture 3 partes de terra comum, 2 partes de composto orgânico (húmus de minhoca ou esterco curtido) e 1 parte de areia de construção para garantir uma boa drenagem. Solos compactados impedem o crescimento das raízes! 🪱",
    rega: "A regra de ouro é: enfie o dedo na terra a uns 2cm de profundidade. Se estiver seco, regue. Regue preferencialmente no início da manhã ou no fim da tarde, evitando molhar as folhas para não atrair fungos. 💧",
    pragas: "Evite venenos químicos! Para afastar pragas, use uma receita simples: dilua 1 colher de sopa de sabão de coco neutro ralado e 1 colher de óleo de cozinha em 1 litro de água morna. Borrife nas folhas no final da tarde, uma vez por semana. Plantar calêndula e manjericão ao redor também repele insetos naturalmente! 🐛❌",
    ods: "O HortaConecta atua diretamente no **ODS 2 da ONU** (Fome Zero e Agricultura Sustentável) promovendo a segurança alimentar urbana, reduzindo o desperdício de alimentos através do marketplace de doações, e regenerando terrenos ociosos na cidade! 🇺🇳🌿",
    cadastro_terreno: "Qualquer pessoa que possua um terreno ocioso pode disponibilizá-lo! Basta ir na opção **Cadastrar Terreno** no menu do HortaConecta, preencher as informações do local e adicionar fotos. Ele aparecerá no nosso mapa interativo instantaneamente! 🗺️",
    insumos: "O **Banco de Insumos** permite a economia compartilhada de ferramentas, sementes, mudas e adubos. Você pode solicitar o empréstimo ou doação clicando no botão do item e combinando a retirada com o anunciante! 🛠️🌱"
  },
  default: "Desculpe, ainda estou aprendendo! Digite palavras-chave como **solo**, **rega**, **pragas**, **ODS**, **cadastro** ou **insumos** para obter dicas rápidas de cultivo e manejo agroecológico. 📚🥕"
};

// Funções Helpers para inicializar e acessar o localStorage
function initializeDatabase() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LANDS)) {
    localStorage.setItem(STORAGE_KEYS.LANDS, JSON.stringify(defaultLands));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INPUTS)) {
    localStorage.setItem(STORAGE_KEYS.INPUTS, JSON.stringify(defaultInputs));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(defaultEvents));
  }
}

// Inicializar banco ao carregar este arquivo
initializeDatabase();

// Métodos de Acesso Globais
const HortaDb = {
  getUsers: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)),
  saveUser: (newUser) => {
    const users = HortaDb.getUsers();
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  getLands: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.LANDS)),
  saveLand: (newLand) => {
    const lands = HortaDb.getLands();
    lands.push(newLand);
    localStorage.setItem(STORAGE_KEYS.LANDS, JSON.stringify(lands));
  },
  getInputs: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.INPUTS)),
  saveInput: (newInput) => {
    const inputs = HortaDb.getInputs();
    inputs.push(newInput);
    localStorage.setItem(STORAGE_KEYS.INPUTS, JSON.stringify(inputs));
  },
  getProducts: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)),
  saveProduct: (newProduct) => {
    const products = HortaDb.getProducts();
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },
  getEvents: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS)),
  getCurrentUser: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)),
  setCurrentUser: (user) => localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user)),
  logout: () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER),
  getPlantingGuide: () => plantingGuide,
  getChatbotResponse: (text) => {
    const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Cumprimentos
    if (normalized.match(/(ola|oi|bom dia|boa tarde|boa noite|ola bot|ola robot)/)) {
      return chatbotResponses.cumprimento[Math.floor(Math.random() * chatbotResponses.cumprimento.length)];
    }
    
    // Despedidas
    if (normalized.match(/(tchau|ate mais|adeus|obrigado|vlw|valeu)/)) {
      return chatbotResponses.despedida[Math.floor(Math.random() * chatbotResponses.despedida.length)];
    }
    
    // Solo
    if (normalized.includes('solo') || normalized.includes('terra') || normalized.includes('adubo') || normalized.includes('composto') || normalized.includes('humus')) {
      return chatbotResponses.duvidas_gerais.solos;
    }
    
    // Rega
    if (normalized.includes('rega') || normalized.includes('molhar') || normalized.includes('agua') || normalized.includes('irrigar') || normalized.includes('umidade')) {
      return chatbotResponses.duvidas_gerais.rega;
    }
    
    // Pragas
    if (normalized.includes('praga') || normalized.includes('inseto') || normalized.includes('pulgão') || normalized.includes('lagarta') || normalized.includes('veneno') || normalized.includes('bicho')) {
      return chatbotResponses.duvidas_gerais.pragas;
    }
    
    // ODS / ONU
    if (normalized.includes('ods') || normalized.includes('onu') || normalized.includes('agenda 2030') || normalized.includes('impacto') || normalized.includes('social') || normalized.includes('esg')) {
      return chatbotResponses.duvidas_gerais.ods;
    }
    
    // Cadastrar Terreno
    if (normalized.includes('cadastro') || normalized.includes('terreno') || normalized.includes('disponibilizar') || normalized.includes('area')) {
      return chatbotResponses.duvidas_gerais.cadastro_terreno;
    }

    // Insumos
    if (normalized.includes('insumo') || normalized.includes('ferramenta') || normalized.includes('semente') || normalized.includes('muda') || normalized.includes('emprestimo')) {
      return chatbotResponses.duvidas_gerais.insumos;
    }
    
    // Padrão
    return chatbotResponses.default;
  }
};
