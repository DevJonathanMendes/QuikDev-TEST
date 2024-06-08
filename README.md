# QuikDev - Teste Prático

Teste prático para desenvolvedores Backend.

## Stack

- **NodeJS v20**: Ambiente de desenvolvimento exigido para o teste.
- **PNPM v9**: Gerenciador de pacotes eficiente em armazenamento e rápido por cache.
- **TypeScript v5**: "JavaScript tipado", muito importante para aplicações de servidor, por confiabilidade e escalabilidade.
- **NestJS v10**: Um framework robusto e estruturado para o desenvolvimento de aplicação para servidor.
- **PrismaORM v5**: Mapeador relacional, facilitará as operações no banco de dados.
- **Docker v24.0.5**: Facilita que aplicação funcione em diferentes máquinas, melhorando a confiabilidade e manutenção. Para o BD e E-mail.
- **PostgreSQL v16.0**: "Já que tá aqui, né", outro BD SQL também serviria.
- **MailHog v1.0.1**: Um utilitário de desenvolvimento de serviço de e-mail.
- **class-transformer/validator v0.5/v0.14**: Para validar dados.
- **@nestjs/Swagger v7**: Para a documentação.
- **compression v1.7**: Para compactar/descompactar requisições.
- **helmet v7**: Adiciona proteção extra nas requisições.
- ~~**Jest v29.5**: Para testes. Muito usado.~~ *Não houve tempo, o desenvolvimento não foi orientado a testes.*
- **HTTPie v2024**: Semelhante ao Postman e Insomnia, só que mais simples. *Não suporta exportação*.
- **Postman v11**: Semelhante ao HTTPie, só que mais complexo.

## Como Inciar a Aplicação

É extremamente importado ter instalado na sua máquina:

- Docker v24;
- NodeJS v20;
- PNPM ou NPM;

### Passos para Iniciar a Aplicação

**Clone o repositório**:
> git clone <URL_DO_REPOSITÓRIO>

**Vá para a Pasta do Projeto**:
> cd <NOME_DO_REPOSITÓRIO>

**Instale as dependências**:

Usando PNPM:
> pnpm install

Usando NPM:
> npm install

**Inicie o Docker Compose**:
> docker-compose up (-d Se quiser rodando em background do terminal)

**Executar migração do Prisma (Banco de Dados)**:
> npx prisma migrate reset --force\
> npx prisma migrate dev\
> npx prisma generate

**Comando para Iniciar a Aplicação**:

NPM:
> npm run start:dev

PNPM:
> pnpm run start:dev

**Útil**:
> npx prisma studio

Para acessar o banco de dados diretamente sem precisar do PgAdmin.

## Tarefas

### Tarefa de Elaboração de Documento

- [x] Documento README.md.
- [x] Estrutura base do sistema (Banco de Dados).
- [x] Sistema de autenticação por token para chamas de REST API.

### Tabela de Usuários

Com o **Usuário** você pode fazer dois processos de CRUD:

- [x] CRUD simples;
  - [x] Colocar checagem de permissão se possuir autenticação;
  - *Não entendi 100%, mas os usuários só tem permissões para editar/remover os próprios dados.*
- [x] Ou se possuir autenticação;
  - [x] Registro na fase de autenticação com edição de perfil do usuário logado
  - *Também não entendi 100%, mas os usuários só podem acessar informações completas de determinadas contas se estiverem autenticados na rota em questão.*

### Tabela de Postagens

Com as **Postagens** é preciso fazer um CRUD simples com algumas exigências:

- [x] Apenas o próprio usuário pode editar ou excluir as postagens;
- [ ] A postagem tenha a possibilidade de adicionar uma imagem em uma API dedicada;
- [ ] As edições sejam salvas como um histórico;
  - *Não daria tempo, criaria uma tabela dedicada como um array nos Posts, onde cada edição adiciona um novo Editions (ou Edit_History).*
- [x] A postagem tenha um contador de visualizações;
- [ ] A postagem tenha um contador de curtidas e não curtidas;
  - *Não daria tempo, usaria uma lógica parecida com a do Views.*

### Tabela de Comentários

Com os **Comentários** é preciso fazer um CRUD simples com algumas exigências:

- [x] Apenas o próprio usuário pode editar os comentários;
- [x] Usuário do comentário pode remover o comentário;
- [x] Usuário da postagem também pode remover o comentário;
- [ ] Adicionar marcador que foi removida pelo usuário ou dono da postagem;
  - *Não daria tempo, criaria uma tabela para os posts onde, ao apagar o comentário, teria as informações do comentário, e não poderia editar/remover a mensagem que diz que apagou.*
- [x] Mandar um e-mail para o usuário da postagem que ele possui um novo comentário em seu post;

### Tarefa de Relatório dos Posts

Crie uma rota que gere um relatório que traga os posts com os seguintes campos:

- [x] Título;
- [x] Quantos comentários eles possuem;
- [x] Quantas visualizações;
- [ ] Quantas curtidas;
- [ ] Quantas não curtidas.

*Talvez não seja um relatório super detalhado, mas já é um início.*

### Tarefa de Documentação

Documentar as chamadas da API com uma ferramenta de requisição e enviar o arquivo de configuração:

- [x] Postman:
  - [Postman Collection v2](./postman/QuikDev-TEST.postman_collection-v2.json)
  - [Postman Collection v2.1](./postman/QuikDev-TEST.postman_collection-v2.1.json)
  - *Acho que está Incompleto. Só tem as rotas testadas manualmente*
- [x] Swagger
  - *Incompleto.*

## Infos / Anotações

- Para mais segurança, é bom adotar mais formas de verificar a autenticidade da requisição.
- ~~A implementação de contagem de visualizações poderia estar melhor implementada.~~
- A verificação de autenticidade pode ser melhorada, parece repetitiva, talvez agrupar no módulo "auth".
- As rotas ~~estão confusas,~~ não foram planejadas, mas não é custoso a refatoração.
- Possibilidade/Sugestão de refatorar o código utilizando decorators personalizados, diminuiria a verbosidade, melhoraria na escalabilidade, no controle da aplicação e na segurança do código.
- Decidi abordar uma maneia diferente nde estruturar as pastas do projeto utilizando NestJS, onde módulos podem estar dentro de módulos; "pai-filho".
- Houve/Corrigido um "bug" que AuthModule não conseguia ler uma variável de ambiente (JWT_TOKEN), só ocorreu com a abordagem nova. Sem tempo para averiguar melhor.
- Não deu tempo de implementar um filtro nos comentários.
- Talvez uma melhoria seja necessária na tabela de comentários, incluir o id do usuário do post, não apenas o id do usuário que comenta. Dessa forma, facilitaria que o dono do post também apagasse o Comment.

## Final

Infelizmente, não houve um desenvolvimento de testes usando o Jest.
Então, para averiguar que a aplicação esteja realmente funcionando, terá que fazer as solicitações manualmente.

Fico a dispor para, se for necessário, um vídeo mostrando/explicando a aplicação.
