
# Sistema de Controle de Empréstimos de Livros

Este é um sistema simples para gerenciar empréstimos de livros, onde você pode registrar, pesquisar, filtrar, e devolver livros emprestados. Ele permite um controle eficaz dos empréstimos, incluindo dados como título, autor, usuário, status e datas de retirada e devolução dos livros.

## Funcionalidades

- **Pesquisar empréstimos**: Permite buscar empréstimos de livros através de um campo de pesquisa por título, autor ou status.
- **Filtrar empréstimos**: Filtros para buscar empréstimos com base na situação, período de retirada e devolução.
- **Devolver livros**: Funcionalidade para devolver livros, alterando o status de "Empréstimo" para "Devolvido".
- **Pesquisa de usuários**: Listagem de usuarios para facilitar o controle.

## Tecnologias

- **Frontend**: React (para o gerenciamento da interface)
- **Backend**: PHP (Laravel), para o gerenciamento da lógica do sistema
- **Banco de Dados**: MySQL
- **Estilo**: Tailwind CSS para um design responsivo e moderno
- **Docker**: Gerenciamento de containers para facilitar o desenvolvimento e deploy
- **Laravel sail**: Ambiente de desenvolvimento com Docker e Docker Compose

## Requisitos

- **PHP** 8.x ou superior
- **Composer** para gerenciamento de dependências
- **Node.js** e **npm** para o gerenciamento do frontend (React)
- **MySQL** ou qualquer outro banco de dados relacional
- **Docker** (opcional) para rodar a aplicação em containers
- **Laravel Sail** (opcional) para um ambiente de desenvolvimento com Docker

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/usuario/sistema-emprestimos.git
cd sistema-emprestimos
```

### 2. Instalar as dependências do backend

Certifique-se de ter o Composer instalado e execute o seguinte comando para instalar as dependências do Laravel:

```bash
composer install
```

### 3. Configurar o banco de dados

Crie um banco de dados no MySQL e configure o arquivo `.env` com suas credenciais:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sistema_emprestimos
DB_USERNAME=root
DB_PASSWORD=
```

Execute as migrações do banco de dados:

```bash
php artisan migrate
```

### 4. Instalar as dependências do frontend

Instale as dependências JavaScript:

```bash
npm install
```

### 5. Rodar o servidor de desenvolvimento

Inicie o servidor Laravel para rodar a aplicação:

```bash
php artisan serve
```

E em outro terminal, inicie o frontend:

```bash
npm run dev
```

### 6. Acessar a aplicação

Abra seu navegador e acesse:

```
http://localhost:8000
```

## Como Usar

### Pesquisa de Empréstimos

- Use o campo de **Buscar empréstimo** para pesquisar por título, autor ou status.

### Filtros de Empréstimos

- **Situação**: Filtro para buscar livros que estão emprestados ou devolvidos.
- **Data de Retirada**: Filtros por período para a data de retirada do livro. (Início e Fim)
- **Data de Devolução**: Filtros por período para a data de devolução do livro. (Início e Fim)

### Devolver Livros

Quando o status do livro for "Empréstimo", será possível clicar no botão **Devolver** para devolver o livro e alterar o status para "Devolvido".

### Paginação

A listagem de empréstimos de livros é paginada. Use os botões de navegação para ir para a próxima ou anterior página.

## Contribuições

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b minha-feature`)
3. Faça o commit das suas alterações (`git commit -am 'Adicionando uma nova feature'`)
4. Envie para a branch principal (`git push origin minha-feature`)
5. Crie uma pull request

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
