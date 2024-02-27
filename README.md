# Projeto de Gerenciamento de Monitoria (backend)

## Sobre
Projeto criado em Dezembro de 2023, que visa realizar operações CRUD acerca do gerenciamento de monitorias dentro do [Departamento de Ciência da Computação (CIC)](https://cic.unb.br/) da [Universidade de Brasília (UnB)](https://unb.br/). Este projeto foi fundado com base no protótipo proposto por Beatriz Chiarelli em sua [monografia](https://bdm.unb.br/handle/10483/36307) e devidamente autorizado pela mesma e pela [Professor PhD Edna Dias Canedo](https://ednacanedo.github.io/), sua orientadora.

## Funcionalidades
Seguindo o protótipo, as funcionalidades são:

### Monitores
- Conseguem criar turmas acerca de uma disciplina;
- Definem horários livres, ocupados ou indisponíveis;
- Podem prover feedback dos estudantes matriculados.

### Alunos
- Pode se matricular em uma turma de monitoria;
- Acompanha os horários das aulas e a agenda dos monitores;
- Tem acesso a uma lista de monitores disponíveis no âmbito geral e filtrado por preferências.

Além disso, para todos os perfis:
- Podem realizar alterações em seu perfil;
- Definem suas preferências de recomendação (por gênero, cor, definido por cota).

## Ferramentas utilizadas
- Bcrypt (criptografia de senha)
- Body-parser (realiza o parse de requisições HTML)
- Consign (organizador de execuções em Node.js)
- Cors (Compartilhamento de Recursos entre Origens Cruzadas)
- Express.js (framework baseado em Node.js)
- Knex (middeware baseado no Postgres 14.5 que controla o banco de dados)
- Moment (gerenciamento de datas)
- Passport (controle de entrada de usuários por perfil)
- Postgres 14.5

## Como executar
Antes, **é necessário ter o [Node](https://nodejs.org/en/) (versão LTS) e o [Postgres](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) (utilizamos a versão 14.6) instalados na máquina**.

Também é necessário **instalar o Npm de forma global em sua máquina**. Digite:
```
npm install -g npm
```
### Backend
- Acesse o terminal (PowerShell ou CMD) e clone este projeto: ```git clone https://github.com/dsslucas/controle-monitoria-backend.git```

### Banco de Dados
- No segundo terminal, não é necessário acessar uma pasta. Digite `psql -U [USUARIO] (no nosso, criei com nome "postgres"` durante o ato de instalação do Postgres
- Crie um banco de dados: `CREATE DATABASE monitoria`
- Conectar ao banco de dados (ou database): `\c monitoria`
- Com isso, o banco de dados deve ser executado.