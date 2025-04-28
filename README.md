# Sistema de Gestão de Cursos e Anotações

Este projeto é uma ferramenta web fullstack para gestão de cursos e anotações de alunos, desenvolvida com tecnologias modernas e integrando bancos de dados relacional (PostgreSQL) e não-relacional (MongoDB).

## Funcionalidades Principais

- Cadastro e autenticação de usuários (alunos e administradores)
- Cadastro e gerenciamento de cursos (armazenados no banco relacional)
- Criação de anotações por parte dos alunos durante as aulas (armazenadas no banco não-relacional)
- Relatórios básicos sobre os cursos e número de anotações por usuário

## Tecnologias Utilizadas

### Backend
- Node.js com Express.js
- PostgreSQL (banco relacional)
- MongoDB (banco não-relacional)
- Sequelize ORM
- Mongoose
- JWT para autenticação
- Swagger para documentação da API

### Frontend
- React
- React Router
- Bootstrap
- Axios

## Estrutura do Projeto

```
curso-gestao/
├── backend/           # API RESTful com Node.js e Express
│   ├── src/
│   │   ├── config/    # Configurações de banco de dados e aplicação
│   │   ├── controllers/ # Controladores da API
│   │   ├── middlewares/ # Middlewares (autenticação, etc.)
│   │   ├── models/    # Modelos de dados (Sequelize e Mongoose)
│   │   ├── routes/    # Rotas da API
│   │   ├── services/  # Serviços de negócio
│   │   ├── utils/     # Utilitários
│   │   ├── app.js     # Configuração do Express
│   │   └── server.js  # Ponto de entrada da aplicação
│   └── package.json
├── frontend/          # Interface de usuário com React
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── pages/     # Páginas da aplicação
│   │   ├── services/  # Serviços para comunicação com a API
│   │   ├── context/   # Contextos React (autenticação, etc.)
│   │   ├── utils/     # Utilitários
│   │   ├── assets/    # Recursos estáticos
│   │   ├── App.jsx    # Componente principal
│   │   └── main.jsx   # Ponto de entrada
│   └── package.json
└── docs/              # Documentação técnica
    ├── use_case_diagram.puml    # Diagrama de casos de uso
    ├── relational_db_diagram.puml # Diagrama do banco relacional
    └── nosql_db_diagram.puml    # Diagrama do banco não-relacional
```

## Instalação e Execução

### Pré-requisitos
- Node.js (v14 ou superior)
- PostgreSQL
- MongoDB

### Configuração do Backend

1. Navegue até a pasta do backend:
```bash
cd curso-gestao/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env`:
```
PORT=5000
JWT_SECRET=sua_chave_secreta
DB_HOST=localhost
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=curso_gestao
MONGODB_URI=mongodb://localhost:27017/curso_gestao
```

4. Inicie o servidor:
```bash
npm start
```

O servidor estará disponível em `http://localhost:5000`.

### Configuração do Frontend

1. Navegue até a pasta do frontend:
```bash
cd curso-gestao/frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie a aplicação:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Documentação da API

A documentação da API está disponível através do Swagger UI em:
```
http://localhost:5000/api-docs
```

## Diagramas

### Diagrama de Casos de Uso
![Diagrama de Casos de Uso](./docs/use_case_diagram.png)

### Diagrama do Banco de Dados Relacional
![Diagrama do Banco Relacional](./docs/relational_db_diagram.png)

### Diagrama do Banco de Dados Não-Relacional
![Diagrama do Banco Não-Relacional](./docs/nosql_db_diagram.png)

## Usuários de Teste

A aplicação é inicializada com os seguintes usuários para teste:

- **Administrador**:
  - Email: admin@example.com
  - Senha: admin123

- **Aluno**:
  - Email: aluno@example.com
  - Senha: aluno123

## Licença

Este projeto está licenciado sob a licença MIT.
