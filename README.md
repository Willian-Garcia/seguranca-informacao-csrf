## CSRF – Demonstração de Ataque e Mitigação

Este projeto tem como objetivo demonstrar, de forma prática, a vulnerabilidade Cross-Site Request Forgery (CSRF) em aplicações web. A estrutura do projeto está dividida em dois servidores:
- server-vitima: aplicação vulnerável que simula funcionalidades reais de um sistema web (login, alteração de senha, cadastro de contatos);
- server-ataque: aplicação controlada pelo atacante, utilizada para forjar requisições maliciosas contra o sistema vítima.

### 📁 Estrutura do projeto
```
├── server-vitima/
│   ├── public/
│   │   └── login.html
│   ├── src/
│   │   ├── routes/
│   │   │   ├── db.ts
│   │   │   └── index.ts
│   │   ├── comandos.sql
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
└── server-ataque/
    ├── public/
    │   ├── csrf-get-attack.html
    │   ├── csrf-post-attack-seguro.html
    │   └── csrf-post-attack.html
    ├── src/
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

### Como executar o projeto

1. Clonando o repositório e instalando as dependências
```
git clone http://github.com/arleysouza/csrf.git server
cd server/server-vitima
npm i
cd ..
cd server/server-ataque
npm i
```

2. Configurando o BD PostgreSQL
- Crie um BD chamado `bdaula` no PostgreSQL (ou outro nome de sua preferência);
- Atualize o arquivo `.env` com os dados de acesso ao banco;

3. Execute os comandos SQL presentes no arquivo `server-vitima/src/comandos.sql` para criar as tabelas necessárias;

4. De acordo com a especificação do protocolo HTTP, a porta não é considerada parte do domínio para fins de escopo de cookies. Desta forma, tanto `localhost:3001` quanto `localhost:3002` estão compartilhando o mesmo cookie de sessão, mesmo sendo servidores diferentes.
Para fazer os testes desse exercício recomendo criar subdomínios diferentes (via hosts). Edite o arquivo `hosts` no seu sistema operacional:
 - Adicione as seguintes linhas no arquivo `C:\Windows\System32\drivers\etc\hosts`:
 ``` 
127.0.0.1   vitima.local
127.0.0.1   atacante.local
```
- O código disponível está configurado para o `server-vitima` rodar em `http://vitima.local:3001` e o `server-ataque` em `http://atacante.local:3002`.

5. Iniciando o servidor
Será necessário executar o comando a seguir em cada um dos servidores (vítima e ataaque):
```
npm start
npm run dev
```
