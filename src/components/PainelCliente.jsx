import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, Check, CheckCircle2, Clock3, FileText, LockKeyhole, MessageSquare, ShieldCheck, CircleHelp, X } from "lucide-react";
import { formatarMoeda, useProjeto } from "../context/ProjetoContext";

const stages = [
  { key: "preProjeto", title: "Pré-projeto", subtitle: "Estudo inicial e definição do escopo", number: "01", detail: "Análise inicial das informações e definição dos principais critérios do projeto." },
  { key: "projetoBasico", title: "Projeto básico", subtitle: "Desenvolvimento e validação das soluções", number: "02", detail: "Desenvolvimento das soluções técnicas e alinhamento das disciplinas selecionadas." },
  { key: "projetoExecutivo", title: "Projeto executivo", subtitle: "Detalhamento para execução da obra", number: "03", detail: "Detalhamento técnico e preparação dos documentos para orientar a execução." },
];

export default function PainelCliente() {
  const { dados, orcamento, aprovarPreProjeto, aprovarProjetoBasico, aprovarProjetoExecutivo } = useProjeto();
  const [modal, setModal] = useState("");
  const [aviso, setAviso] = useState("");
  if (!dados.solicitacao.enviada) return <div className="empty-panel panel"><span className="empty-panel-icon"><ClipboardIcon/></span><h2>Você ainda não tem uma solicitação</h2><p>Faça uma simulação de orçamento e envie seus dados para visualizar o painel do cliente.</p><Link className="button-primary" to="/">Começar simulação <ArrowRight size={17}/></Link></div>;

  const allDone = stages.every((s) => dados.etapas[s.key] === "concluido");
  const current = stages.find((s) => dados.etapas[s.key] === "aguardando");
  const approve = () => {
    if (modal === "preProjeto") aprovarPreProjeto();
    if (modal === "projetoBasico") aprovarProjetoBasico();
    if (modal === "projetoExecutivo") aprovarProjetoExecutivo();
    setAviso("Etapa aprovada nesta demonstração. A próxima etapa foi atualizada.");
    setModal("");
  };
  return <div className="space-y-7">
    <section className="dashboard-hero"><div><span className="step-label">ÁREA DO CLIENTE</span><h1>Olá, {dados.usuario.nome.split(" ")[0]}!</h1><p>Acompanhe o andamento da sua solicitação e aprove cada etapa do projeto.</p></div><div className="dashboard-status"><span className={`status-pill ${allDone ? "status-complete" : ""}`}><span/>{allDone ? "Projeto concluído" : "Em andamento"}</span><small>Solicitação {dados.solicitacao.id}</small></div></section>
    {aviso && <div className="inline-success"><CheckCircle2 size={18}/>{aviso}<button onClick={() => setAviso("")} aria-label="Fechar"><X size={16}/></button></div>}
    <div className="dashboard-grid">
      <section className="panel timeline-panel">
        <div className="section-heading compact"><div><h2>Etapas do projeto</h2><p>As próximas etapas são liberadas após sua aprovação.</p></div><span className="timeline-count">{stages.filter((s) => dados.etapas[s.key] === "concluido").length} de 3 concluídas</span></div>
        <div className="timeline">{stages.map((s, i) => { const status = dados.etapas[s.key]; const done = status === "concluido"; const blocked = status === "bloqueado"; const active = status === "aguardando"; return <div className={`timeline-item ${done ? "timeline-done" : ""} ${blocked ? "timeline-blocked" : ""}`} key={s.key}><div className="timeline-rail"><div className="timeline-node">{done ? <Check size={19}/> : blocked ? <LockKeyhole size={16}/> : s.number}</div>{i < 2 && <div className="timeline-connector"/>}</div><div className="timeline-content"><div className="timeline-title-row"><div><h3>{s.title}</h3><p>{s.subtitle}</p></div><span className={`stage-status ${done ? "stage-status-done" : blocked ? "stage-status-blocked" : "stage-status-active"}`}>{done ? "Concluída" : blocked ? "Bloqueada" : "Aguardando aprovação"}</span></div>{active && <div className="stage-detail"><p>{s.detail}</p><div className="stage-actions"><button className="button-primary" onClick={() => setModal(s.key)}>Aprovar etapa <ArrowRight size={16}/></button><button className="button-secondary" onClick={() => setAviso("Nesta demonstração, os arquivos desta etapa ainda não estão disponíveis.")}><FileText size={16}/> Ver arquivos</button></div></div>}{blocked && <p className="blocked-hint"><LockKeyhole size={14}/> Será liberada após a aprovação da etapa anterior.</p>}{done && <p className="completed-hint"><CheckCircle2 size={15}/> Aprovação registrada nesta demonstração.</p>}</div></div>; })}</div>
        {allDone && <div className="project-finished"><CheckCircle2 size={22}/><div><strong>Etapas demonstrativas concluídas!</strong><p>O fluxo de aprovação funcionou. A entrega real dos projetos exigiria integração com a equipe e um servidor.</p></div></div>}
      </section>
      <aside className="space-y-5">
        <section className="panel details-panel"><div className="panel-title"><span className="number-badge"><FileText size={17}/></span><div><h3>Resumo do projeto</h3><p>Dados informados na solicitação</p></div></div><div className="detail-line"><span>Cliente</span><strong>{dados.usuario.nome}</strong></div><div className="detail-line"><span>Tipo de obra</span><strong>{dados.obra.tipo}</strong></div><div className="detail-line"><span>Área construída</span><strong>{dados.obra.area} m²</strong></div><div className="detail-line"><span>Pavimentos</span><strong>{dados.obra.pavimentos}</strong></div><div className="budget-divider"/><div className="selected-services"><span>Disciplinas solicitadas</span>{orcamento.itens.map((p) => <div key={p.id}><CheckCircle2 size={15}/>{p.nome}</div>)}</div><div className="summary-total"><span>Estimativa inicial</span><strong>{formatarMoeda(orcamento.total)}</strong></div></section>
        <section className="panel help-panel"><span className="help-icon"><MessageSquare size={20}/></span><h3>Precisa de ajuda?</h3><p>Esta é uma demonstração do painel. Os canais de atendimento serão configurados na versão publicada.</p><button className="button-secondary button-full" onClick={() => setAviso("O atendimento ainda não está conectado nesta versão demonstrativa.")}>Solicitar contato</button></section>
      </aside>
    </div>
    {modal && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal-card"><button className="modal-close" onClick={() => setModal("")} aria-label="Fechar"><X size={19}/></button><span className="modal-icon"><ShieldCheck size={25}/></span><h2>Confirmar aprovação?</h2><p>Ao aprovar esta etapa demonstrativa, o sistema libera a etapa seguinte do fluxo.</p><div className="modal-actions"><button className="button-secondary" onClick={() => setModal("")}>Voltar</button><button className="button-primary" onClick={approve}>Confirmar aprovação <ArrowRight size={16}/></button></div></div></div>}
  </div>;
}
function ClipboardIcon() { return <CircleHelp size={27}/>; }
