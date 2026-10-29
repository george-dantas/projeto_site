import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, CheckCircle2, FileText, ShieldCheck, Zap, Droplets, Boxes, Building2, Clock3, Settings2 } from "lucide-react";
import { PROJETOS, TIPOS_OBRA, formatarMoeda, useProjeto } from "../context/ProjetoContext";

const icons = { estrutural: Boxes, eletrico: Zap, hidrossanitario: Droplets };

export default function Simulador() {
  const { dados, orcamento, atualizarObra } = useProjeto();
  const navigate = useNavigate();
  const obra = dados.obra;
  const toggleProjeto = (id) => {
    const next = obra.projetos.includes(id) ? obra.projetos.filter((x) => x !== id) : [...obra.projetos, id];
    atualizarObra("projetos", next);
  };

  return (
    <div className="home-content">
      <section className="home-hero" id="inicio">
        <img className="home-hero-photo" src={`${import.meta.env.BASE_URL}hero-construction.jpg`} alt="Residência contemporânea em construção, com estrutura aparente e acabamentos modernos" />
        <div className="home-hero-shade" />
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <div className="home-eyebrow"><span /> Projetos completos para sua obra</div>
            <h1>Mais segurança,<br /><em>eficiência e economia</em><br />para o seu projeto.</h1>
            <p>Projetos estruturais, elétricos e hidrossanitários para planejar cada etapa da sua obra com clareza.</p>
            <a className="home-hero-cta" href="#simulador"><FileText size={19} /> Solicitar orçamento <ArrowRight size={19} /></a>
            <span className="home-hero-note">Estimativa inicial em poucos passos</span>
          </div>
          <div className="home-discipline-labels" aria-label="Disciplinas disponíveis">
            <div><Building2 size={22} /><span>Projeto<br /><strong>Estrutural</strong></span></div>
            <div><Zap size={22} /><span>Projeto<br /><strong>Elétrico</strong></span></div>
            <div><Droplets size={22} /><span>Projeto<br /><strong>Hidrossanitário</strong></span></div>
          </div>
        </div>
      </section>

      <section className="home-services" id="projetos" aria-label="Projetos de engenharia">
        {PROJETOS.map((project, index) => {
          const Icon = icons[project.id];
          return (
            <article className={`home-service-card home-service-${project.id}`} key={project.id}>
              <div className="service-card-heading">
                <span className="service-card-icon"><Icon size={23} /></span>
                <span className="service-card-index">0{index + 1}</span>
              </div>
              <h2>{project.nome}</h2>
              <p>{project.descricao}</p>
              <div className="service-card-plan" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
              <a href="#simulador" className="service-card-link" aria-label={`Ver ${project.nome} no simulador`}>
                Ver no simulador <ArrowRight size={16} />
              </a>
            </article>
          );
        })}
      </section>

      <section className="home-benefits" id="sobre" aria-label="Como funciona">
        <div><span className="benefit-icon"><ShieldCheck size={24} /></span><p><strong>Validação técnica</strong><small>Proposta final após análise dos documentos.</small></p></div>
        <div><span className="benefit-icon"><Clock3 size={24} /></span><p><strong>Estimativa inicial</strong><small>Valores calculados com os dados da sua obra.</small></p></div>
        <div><span className="benefit-icon"><Settings2 size={24} /></span><p><strong>Projetos por disciplina</strong><small>Selecione os serviços adequados ao projeto.</small></p></div>
        <div><span className="benefit-icon"><FileText size={24} /></span><p><strong>Acompanhamento</strong><small>Consulte as etapas pelo painel do cliente.</small></p></div>
      </section>

      <section className="simulator-section" id="simulador">
        <div className="section-heading">
          <div><span className="step-label">PASSO 1 DE 3</span><h2>Simule seu orçamento</h2><p>Informe os dados básicos da obra para calcular uma estimativa.</p></div>
          <div className="step-track"><span className="step-active" /><span /><span /></div>
        </div>

        <div className="simulator-grid">
        <section className="panel form-panel">
          <div className="panel-title"><span className="number-badge">01</span><div><h3>Características da obra</h3><p>Conte um pouco sobre o projeto.</p></div></div>
          <label className="field-label" htmlFor="tipo">Tipo de obra</label>
          <div className="type-grid">
            {TIPOS_OBRA.map((tipo) => <button type="button" key={tipo} className={`type-option ${obra.tipo === tipo ? "selected" : ""}`} onClick={() => atualizarObra("tipo", tipo)}><span className="type-icon"><Building2Icon /></span><span>{tipo}</span>{obra.tipo === tipo && <CheckCircle2 size={17} className="type-check" />}</button>)}
          </div>
          <div className="fields-two">
            <div><label className="field-label" htmlFor="area">Área construída (m²)</label><div className="input-unit"><input id="area" type="number" min="1" max="100000" value={obra.area} onChange={(e) => atualizarObra("area", e.target.value)} /><span>m²</span></div></div>
            <div><label className="field-label" htmlFor="pavimentos">Número de pavimentos</label><select id="pavimentos" value={obra.pavimentos} onChange={(e) => atualizarObra("pavimentos", Number(e.target.value))}>{[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n} {n === 1 ? "pavimento" : "pavimentos"}</option>)}</select></div>
          </div>

          <div className="divider" />
          <div className="panel-title"><span className="number-badge">02</span><div><h3>Escolha os projetos</h3><p>Você pode selecionar uma ou mais disciplinas.</p></div></div>
          <div className="project-options">
            {PROJETOS.map((p) => { const Icon = icons[p.id]; const active = obra.projetos.includes(p.id); return <button type="button" key={p.id} onClick={() => toggleProjeto(p.id)} className={`project-option ${active ? "selected" : ""}`}><span className="project-icon"><Icon size={21}/></span><span className="project-copy"><strong>{p.nome}</strong><small>{p.descricao}</small></span><span className={`custom-check ${active ? "checked" : ""}`}>{active && <Check size={13}/>}</span></button>; })}
          </div>
          {obra.projetos.includes("estrutural") && <div className="extra-options"><label className="field-label" htmlFor="estrutura">Tipo de estrutura</label><select id="estrutura" value={obra.estruturalTipo} onChange={(e) => atualizarObra("estruturalTipo", e.target.value)}><option>Concreto armado</option><option>Estrutura metálica</option><option>Estrutura mista</option></select></div>}
          {obra.projetos.includes("eletrico") && <div className="extras-checks"><label><input type="checkbox" checked={obra.pontosEletricos} onChange={(e) => atualizarObra("pontosEletricos", e.target.checked)} /> Planta de pontos elétricos</label><label><input type="checkbox" checked={obra.luminotecnico} onChange={(e) => atualizarObra("luminotecnico", e.target.checked)} /> Projeto luminotécnico</label></div>}
          {obra.projetos.includes("hidrossanitario") && <div className="extras-checks"><label><input type="checkbox" checked={obra.reusoAgua} onChange={(e) => atualizarObra("reusoAgua", e.target.checked)} /> Reuso de água</label><label><input type="checkbox" checked={obra.captacaoPluvial} onChange={(e) => atualizarObra("captacaoPluvial", e.target.checked)} /> Captação de água pluvial</label><label><input type="checkbox" checked={obra.piscina} onChange={(e) => atualizarObra("piscina", e.target.checked)} /> A obra possui piscina</label></div>}
        </section>

        <aside className="panel budget-panel">
          <div className="budget-top"><span className="budget-icon"><FileText size={20}/></span><div><h3>Resumo do orçamento</h3><p>Estimativa inicial</p></div></div>
          <div className="budget-total-label">VALOR ESTIMADO</div>
          <div className="budget-total">{formatarMoeda(orcamento.total)}</div>
          <div className="budget-note">O valor poderá ser ajustado após análise dos documentos técnicos.</div>
          <div className="budget-divider" />
          <div className="budget-lines">
            {orcamento.itens.length ? orcamento.itens.map((item) => <div className="budget-line" key={item.id}><span>{item.nome}</span><strong>{formatarMoeda(item.valor)}</strong></div>) : <p className="empty-budget">Selecione ao menos um projeto para calcular o valor.</p>}
          </div>
          <div className="budget-meta"><div><span>Tipo de obra</span><strong>{obra.tipo}</strong></div><div><span>Área informada</span><strong>{Number(obra.area) || 0} m²</strong></div><div><span>Pavimentos</span><strong>{obra.pavimentos}</strong></div></div>
          <button className="button-primary button-full" disabled={!obra.projetos.length || Number(obra.area) <= 0} onClick={() => navigate("/cadastro")}>Solicitar confirmação do orçamento <ArrowRight size={18}/></button>
          <p className="fine-print"><ShieldCheck size={14}/> Sem compromisso. A proposta final depende de validação técnica.</p>
        </aside>
        </div>
        <section className="trust-strip"><div><span className="trust-icon"><ShieldCheck size={20}/></span><div><strong>Validação técnica</strong><small>Documentos analisados antes da proposta final.</small></div></div><div><span className="trust-icon"><FileText size={20}/></span><div><strong>Proposta formal</strong><small>Escopo e valores revisados antes de contratar.</small></div></div><div><span className="trust-icon"><CheckCircle2 size={20}/></span><div><strong>Etapas transparentes</strong><small>Acompanhe a evolução pelo painel.</small></div></div></section>
      </section>

      <section className="home-faq" id="duvidas">
        <div className="home-faq-heading"><span className="step-label">DÚVIDAS FREQUENTES</span><h2>Antes de solicitar</h2><p>Saiba como funciona a estimativa e o próximo passo.</p></div>
        <div className="home-faq-list">
          <details><summary>O valor exibido já é a proposta final?</summary><p>Não. O simulador calcula uma estimativa inicial com base na área, no número de pavimentos e nos projetos selecionados. A proposta final depende de validação técnica.</p></details>
          <details><summary>Quais projetos posso incluir?</summary><p>Você pode selecionar projetos estrutural, elétrico e hidrossanitário, além das opções adicionais disponíveis no formulário.</p></details>
          <details><summary>O que acontece depois de solicitar?</summary><p>Você informa seus dados e envia os documentos da obra para análise. Depois, pode acompanhar as etapas pelo painel do cliente.</p></details>
        </div>
      </section>

      <section className="home-contact" id="contato">
        <div><span className="step-label">+PROJETOS</span><h2>Conectar, projetar, realizar.</h2><p>Comece com uma estimativa e informe os detalhes da sua obra.</p></div>
        <a href="#simulador" className="button-primary">Solicitar orçamento <ArrowRight size={18} /></a>
      </section>
    </div>
  );
}
function Building2Icon() { return <span className="building-icon-shape">▥</span>; }
