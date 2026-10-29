import { createContext, useContext, useMemo, useState } from "react";

const ProjetoContext = createContext(null);

export const PROJETOS = [
  { id: "estrutural", nome: "Projeto estrutural", descricao: "Concreto armado, estrutura metálica ou mista", preco: 15 },
  { id: "eletrico", nome: "Projeto elétrico", descricao: "Instalações elétricas de baixa tensão", preco: 12 },
  { id: "hidrossanitario", nome: "Projeto hidrossanitário", descricao: "Água fria/quente, esgoto e águas pluviais", preco: 12 },
];

export const TIPOS_OBRA = ["Residencial", "Comercial", "Industrial"];

const initial = {
  obra: {
    tipo: "Residencial",
    area: 180,
    pavimentos: 2,
    projetos: ["estrutural", "eletrico", "hidrossanitario"],
    estruturalTipo: "Concreto armado",
    pontosEletricos: false,
    luminotecnico: false,
    reusoAgua: false,
    captacaoPluvial: false,
    piscina: false,
  },
  usuario: { nome: "", email: "", telefone: "" },
  arquivos: { arquitetonico: null, sondagem: null, topografico: null },
  solicitacao: { enviada: false, id: "", criadaEm: "" },
  etapas: { preProjeto: "aguardando", projetoBasico: "bloqueado", projetoExecutivo: "bloqueado" },
};

export function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

export function ProjetoProvider({ children }) {
  const [dados, setDados] = useState(initial);

  const atualizarObra = (campo, valor) => setDados((d) => ({ ...d, obra: { ...d.obra, [campo]: valor } }));
  const atualizarUsuario = (campo, valor) => setDados((d) => ({ ...d, usuario: { ...d.usuario, [campo]: valor } }));
  const atualizarArquivo = (campo, arquivo) => setDados((d) => ({ ...d, arquivos: { ...d.arquivos, [campo]: arquivo } }));

  const orcamento = useMemo(() => {
    const area = Math.max(0, Number(dados.obra.area) || 0);
    const fatorPavimentos = 1 + Math.max(0, Number(dados.obra.pavimentos) - 1) * 0.1;
    const itens = PROJETOS.filter((p) => dados.obra.projetos.includes(p.id)).map((p) => ({
      ...p,
      valor: area * p.preco * fatorPavimentos,
    }));
    const total = itens.reduce((s, p) => s + p.valor, 0);
    return { itens, total };
  }, [dados.obra]);

  const registrarSolicitacao = () => {
    const id = `MP-${Date.now().toString().slice(-6)}`;
    setDados((d) => ({
      ...d,
      solicitacao: { enviada: true, id, criadaEm: new Date().toLocaleDateString("pt-BR") },
      etapas: { preProjeto: "aguardando", projetoBasico: "bloqueado", projetoExecutivo: "bloqueado" },
    }));
    return id;
  };

  const aprovarEtapa = (etapa, proxima) => setDados((d) => ({
    ...d,
    etapas: { ...d.etapas, [etapa]: "concluido", ...(proxima ? { [proxima]: "aguardando" } : {}) },
  }));

  const resetar = () => setDados(initial);

  return (
    <ProjetoContext.Provider value={{
      dados, orcamento, atualizarObra, atualizarUsuario, atualizarArquivo, registrarSolicitacao,
      aprovarPreProjeto: () => aprovarEtapa("preProjeto", "projetoBasico"),
      aprovarProjetoBasico: () => aprovarEtapa("projetoBasico", "projetoExecutivo"),
      aprovarProjetoExecutivo: () => aprovarEtapa("projetoExecutivo", null),
      resetar,
    }}>
      {children}
    </ProjetoContext.Provider>
  );
}

export function useProjeto() {
  const ctx = useContext(ProjetoContext);
  if (!ctx) throw new Error("useProjeto deve ser usado dentro de ProjetoProvider.");
  return ctx;
}
