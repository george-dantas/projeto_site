import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, FileUp, FileText, ShieldCheck, X, UserRound } from "lucide-react";
import { formatarMoeda, useProjeto } from "../context/ProjetoContext";

function UploadField({ title, description, accept, file, onChange, required }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const handleFile = (f) => {
    setError("");
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("O arquivo ultrapassa o limite de 20 MB."); return; }
    const ext = f.name.split(".").pop().toLowerCase();
    const allowed = accept.split(",").map((x) => x.trim().replace(".", ""));
    if (!allowed.includes(ext)) { setError(`Formato não permitido. Use: ${accept}.`); return; }
    onChange(f);
  };
  return <div className="upload-field">
    <div className="upload-heading"><span className="upload-icon"><FileText size={19}/></span><div><strong>{title}{required && <em> *</em>}</strong><small>{description}</small></div></div>
    {file ? <div className="file-selected"><CheckCircle2 size={18}/><span><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></span><button type="button" aria-label="Remover arquivo" onClick={() => onChange(null)}><X size={17}/></button></div> : <button type="button" className="upload-drop" onClick={() => inputRef.current?.click()}><FileUp size={23}/><span><strong>Clique para selecionar o arquivo</strong><small>Formatos: {accept} · Máximo 20 MB</small></span></button>}
    <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])}/>
    {error && <p className="upload-error">{error}</p>}
  </div>;
}

export default function Cadastro() {
  const { dados, orcamento, atualizarUsuario, atualizarArquivo, registrarSolicitacao } = useProjeto();
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const user = dados.usuario;
  const enviar = (e) => {
    e.preventDefault();
    if (!user.nome.trim() || !user.email.trim() || !user.telefone.trim()) { setErro("Preencha nome, e-mail e telefone."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) { setErro("Informe um e-mail válido."); return; }
    if (!dados.arquivos.arquitetonico) { setErro("Anexe o projeto arquitetônico para solicitar a validação."); return; }
    setErro("");
    registrarSolicitacao();
    navigate("/sucesso");
  };
  return <div className="space-y-7">
    <div className="section-heading"><div><span className="step-label">PASSO 2 DE 3</span><h2>Solicite a validação do orçamento</h2><p>Preencha seus dados e envie os documentos disponíveis para análise técnica.</p></div><div className="step-track"><span className="step-done"/><span className="step-active"/><span/></div></div>
    <form onSubmit={enviar} className="cadastro-grid">
      <div className="space-y-6">
        <section className="panel form-panel">
          <div className="panel-title"><span className="number-badge"><UserRound size={17}/></span><div><h3>Seus dados</h3><p>Usaremos estas informações para entrar em contato.</p></div></div>
          <div className="fields-one"><div><label className="field-label" htmlFor="nome">Nome completo *</label><input id="nome" value={user.nome} onChange={(e) => atualizarUsuario("nome", e.target.value)} placeholder="Digite seu nome completo" autoComplete="name"/></div><div><label className="field-label" htmlFor="email">E-mail *</label><input id="email" type="email" value={user.email} onChange={(e) => atualizarUsuario("email", e.target.value)} placeholder="voce@exemplo.com" autoComplete="email"/></div><div><label className="field-label" htmlFor="telefone">Telefone / WhatsApp *</label><input id="telefone" value={user.telefone} onChange={(e) => atualizarUsuario("telefone", e.target.value)} placeholder="(00) 00000-0000" autoComplete="tel"/></div></div>
        </section>
        <section className="panel form-panel">
          <div className="panel-title"><span className="number-badge"><FileUp size={17}/></span><div><h3>Documentos técnicos</h3><p>Arquivos ajudam nossa equipe a validar o orçamento.</p></div></div>
          <div className="upload-list">
            <UploadField title="Projeto arquitetônico" description="Documento base da obra" accept=".pdf,.dwg" file={dados.arquivos.arquitetonico} onChange={(f) => atualizarArquivo("arquitetonico", f)} required/>
            <UploadField title="Relatório de sondagem" description="Opcional, recomendado para projeto estrutural" accept=".pdf" file={dados.arquivos.sondagem} onChange={(f) => atualizarArquivo("sondagem", f)}/>
            <UploadField title="Levantamento topográfico" description="Opcional, quando disponível" accept=".pdf,.dwg" file={dados.arquivos.topografico} onChange={(f) => atualizarArquivo("topografico", f)}/>
          </div>
          <p className="privacy-note"><ShieldCheck size={16}/> Nesta versão demonstrativa, os arquivos ficam apenas nesta sessão do navegador; não são enviados para um servidor.</p>
        </section>
      </div>
      <aside className="panel budget-panel sticky-panel">
        <div className="budget-top"><span className="budget-icon"><FileText size={20}/></span><div><h3>Resumo da solicitação</h3><p>Confira antes de enviar</p></div></div>
        <div className="summary-detail"><span>Tipo de obra</span><strong>{dados.obra.tipo}</strong></div>
        <div className="summary-detail"><span>Área construída</span><strong>{dados.obra.area} m²</strong></div>
        <div className="summary-detail"><span>Pavimentos</span><strong>{dados.obra.pavimentos}</strong></div>
        <div className="budget-divider"/>
        <div className="selected-services"><span>Projetos selecionados</span>{orcamento.itens.map((p) => <div key={p.id}><CheckCircle2 size={16}/>{p.nome}</div>)}</div>
        <div className="summary-total"><span>Estimativa atual</span><strong>{formatarMoeda(orcamento.total)}</strong></div>
        <p className="budget-note">Após o envio, a equipe poderá analisar a documentação e confirmar o escopo e os valores em até 3 dias úteis.</p>
        {erro && <p className="form-error">{erro}</p>}
        <button className="button-primary button-full" type="submit">Enviar para validação <ArrowRight size={18}/></button>
        <button className="button-secondary button-full mt-3" type="button" onClick={() => navigate("/")}><ArrowLeft size={17}/> Voltar ao simulador</button>
        <p className="fine-print">* Campos obrigatórios. O orçamento é uma estimativa inicial.</p>
      </aside>
    </form>
  </div>;
}
