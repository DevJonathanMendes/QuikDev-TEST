# QuikDev-TEST

Teste prático para desenvolvedores Backend.

## Stack

- **NodeJS v20**: Ambiente de desenvolvimento exigido para o teste.
- **PNPM v9**: Gerenciador de pacotes eficiente em armazenamento e rápido por cache.
- **TypeScript v5**: "JavaScript tipado", muito importante para aplicações de servidor, por confiabilidade e escalabilidade.
- **NestJS v10**: Um framework robusto e estruturado para o desenvolvimento de aplicação para servidor.
- **PrismaORM v5**: Mapeador relacional, facilitará as operações no banco de dados.
- **Docker:** Facilita que aplicação funcione em diferentes máquinas, aumentando sua confiabilidade e a sua manutenção. Mas será apenas para o banco de dados.
- **PostgreSQL vLatest**: "Já que tá aqui, né", outro BD SQL também serviria.
- **class-transformer/validator v0.5/v0.14**: Para validar dados.
- **@nestjs/Swagger v7**: Para a documentação.
- **compression v1.7**: Para compactar/descompactar requisições.
- **helmet v7**: Adiciona proteção extra nas requisições.
- **Jest v29.5**: Para testes. Muito usado.
- **HTTPie v2024**: Semelhante ao Postman e Insomnia, só que mais simples. *Não suporta exportação*.
- **Postman v11**: Semelhante ao HTTPie, só que mais complexo.

## Como Subir a Aplicação

## Feitos

- [x] Documento README.md.
- [x] Estrutura base do sistema (Banco de Dados).
- [x] Sistema de autenticação por token para chamas de REST API.

Com o **Usuário** você pode fazer dois processos de CRUD:

- [x] CRUD simples;
  - [x] Colocar checagem de permissão se possuir autenticação;
  - Não entendi 100%, mas usuários não tem permissões para editar/remover dados de outros usuários.
- [x] Ou se possuir autenticação;
  - [x] Registro na fase de autenticação com edição de perfil do usuário logado
  - Também não entendi 100%, mas os usuários só podem acessar informações completas de determinadas contas se estiverem autenticados na rota em questão.

Com as **Postagens** é preciso fazer um CRUD simples com algumas exigências:

- [x] Apenas o próprio usuário pode editar ou excluir as postagens;
- [ ] A postagem tenha a possibilidade de adicionar uma imagem em uma API dedicada;
- [ ] As edições sejam salvas como um histórico;
  - Não daria tempo, criaria uma tabela dedicada como um array nos Posts, onde cada edição adiciona um novo Editions (ou Edit_History).
- [x] A postagem tenha um contador de visualizações;
- [ ] A postagem tenha um contador de curtidas e não curtidas;
  - Não daria tempo, usaria uma lógica parecida com a do Views.

Com os **Comentários** é preciso fazer um CRUD simples com algumas exigências:

- [x] Apenas o próprio usuário pode editar os comentários;
- [x] Usuário do comentário pode remover o comentário;
- [x] Usuário da postagem também pode remover o comentário;
- [ ] Adicionar marcador que foi removida pelo usuário ou dono da postagem;
  - Não daria tempo, criaria uma tabela para os posts onde, ao apagar o comentário, teria as informações do comentário, e não poderia editar/remover a mensagem que diz que apagou.
- [ ] Mandar um e-mail para o usuário da postagem que ele possui um novo comentário em seu post;

Crie uma rota que gere um relatório que traga os posts com os seguintes campos:

- [ ] Título;
- [ ] Quantos comentários eles possuem;
- [ ] Quantas visualizações;
- [ ] Quantas curtidas;
- [ ] Quantas não curtidas.

Documentar as chamadas da API com uma ferramenta de requisição e enviar o arquivo de configuração:

- [ ] Postman

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
