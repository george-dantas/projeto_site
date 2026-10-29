import { Link, Navigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, ClipboardList, FileCheck2 } from "lucide-react";
import { formatarMoeda, useProjeto } from "../context/ProjetoContext";

export default function Sucesso() {
  const { dados, orcamento } = useProjeto();
  if (!dados.solicitacao.enviada) return <Navigate to="/" replace />;
  return <div className="success-wrap">
    <div className="success-icon"><CheckCircle2 size={38}/></div>
    <span className="step-label">SOLICITAÇÃO REGISTRADA</span>
    <h1>Recebemos seus dados!</h1>
    <p className="success-lead">Sua solicitação foi registrada nesta demonstração. A próxima etapa é a análise técnica dos documentos.</p>
    <div className="request-number"><span>Número da solicitação</span><strong>{dados.solicitacao.id}</strong><small>Registrada em {dados.solicitacao.criadaEm}</small></div>
    <div className="panel success-summary"><div><span>Cliente</span><strong>{dados.usuario.nome}</strong></div><div><span>Tipo de obra</span><strong>{dados.obra.tipo}</strong></div><div><span>Área construída</span><strong>{dados.obra.area} m²</strong></div><div><span>Estimativa</span><strong>{formatarMoeda(orcamento.total)}</strong></div></div>
    <div className="next-step-box"><FileCheck2 size={22}/><div><strong>O que acontece agora?</strong><p>A proposta poderá ser confirmada em até 3 dias úteis após a análise. Você poderá acompanhar as etapas pelo painel demonstrativo.</p></div></div>
    <div className="success-actions"><Link to="/painel" className="button-primary">Acompanhar meu projeto <ArrowRight size={18}/></Link><Link to="/" className="button-secondary">Voltar ao início</Link></div>
    <p className="demo-disclaimer">Demonstração: os dados não são persistidos em banco de dados e serão perdidos ao atualizar a página.</p>
  </div>;
}
