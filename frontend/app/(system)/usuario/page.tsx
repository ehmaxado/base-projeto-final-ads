// pagina de usuario
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function UsuarioPage() {
  return (
    <div className="page-content">
      <PageIntro
        title="Aqui e a tela de usuario"
        description="aqui vai a parte do usuario"
        primaryActionLabel="salvar alteracoes"
      />

      <div className="page-grid page-grid--two-columns">
        <SectionCard title="Aqui vai os dados do usuario">
          <form className="form-stack">
            <div>
              <label htmlFor="usuarioNome" className="form-label">
                nome completo
              </label>
              <input
                id="usuarioNome"
                name="nomeCompleto"
                className="form-control"
                defaultValue="Usuario Demonstracao"
              />
            </div>

            <div>
              <label htmlFor="usuarioEmail" className="form-label">
                Email
              </label>
              <input
                id="usuarioEmail"
                name="email"
                type="email"
                className="form-control"
                defaultValue="demo@sistema.local"
              />
            </div>

            <div>
              <label htmlFor="usuarioPerfil" className="form-label">
                perfil
              </label>
              <input
                id="usuarioPerfil"
                name="perfil"
                className="form-control"
                defaultValue="operador"
                disabled
              />
            </div>
          </form>
        </SectionCard>

        <SectionCard title="Aqui vai a troca de senha">
          <form className="form-stack">
            <div>
              <label htmlFor="senhaAtual" className="form-label">
                senha atual
              </label>
              <input id="senhaAtual" name="senhaAtual" type="password" className="form-control" />
            </div>

            <div>
              <label htmlFor="novaSenha" className="form-label">
                Nova senha
              </label>
              <input id="novaSenha" name="novaSenha" type="password" className="form-control" />
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="form-label">
                Confirmar nova senha
              </label>
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                className="form-control"
              />
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-primary">
                atualizar senha
              </button>
              <button type="button" className="btn btn-outline-secondary">
                limpar
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
