# +Projetos

Site responsivo para apresentação dos serviços de projetos de engenharia, com simulador de orçamento, cadastro de solicitação e painel do cliente.

## Requisitos

- Node.js 20.19 ou superior
- npm

## Executar localmente

No terminal, dentro desta pasta:

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite (normalmente `http://localhost:5173`).

Para gerar e visualizar a versão de produção:

```bash
npm run build
npm run preview
```

O app é frontend e não precisa de um servidor API para iniciar. Os dados de orçamento e solicitação ficam no estado da sessão do navegador e são reiniciados ao recarregar a página.
