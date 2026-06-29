import PageIntro from '@/components/PageIntro'
import SectionCard from '@/components/SectionCard'
import { apiServerFetch } from '@/lib/api-server'
import { UsuarioAtual, atualizarUsuario, atualizarSenha } from './actions'

async function getUsuarioAtual() {
  const response = await apiServerFetch('/usuarios/atual', { cache: 'no-store' })
  return response.ok ? ((await response.json()) as UsuarioAtual) : null
}

export default async function UsuarioPage() {
  const usuario = await getUsuarioAtual()

  if (!usuario) {
    return (
      <div className="page-content">
        <PageIntro
          title="Usuário"
          description="Não foi possível carregar os dados do usuário."
        />
        <SectionCard title="Erro ao obter usuário">
          <p className="mb-0">Verifique se você está autenticado e tente novamente.</p>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="page-content">
      <PageIntro
        title="Usuário"
        description="Atualize seus dados de perfil e senha."
      />

      <div className="page-grid page-grid--two-columns">
        <SectionCard title="Dados do usuário">
          <form action={atualizarUsuario} className="form-stack">
            <div>
              <label htmlFor="usuarioNome" className="form-label">
                Nome completo
              </label>
              <input
                id="usuarioNome"
                name="nomeCompleto"
                className="form-control"
                defaultValue={usuario.nomeCompleto}
                required
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
                defaultValue={usuario.email}
                required
              />
            </div>

            <div>
              <label htmlFor="usuarioPerfil" className="form-label">
                Perfil
              </label>
              <input
                id="usuarioPerfil"
                name="perfil"
                className="form-control"
                defaultValue={usuario.perfil}
                disabled
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                salvar alterações
              </button>
              <button type="reset" className="btn btn-outline-secondary">
                limpar
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard title="Troca de senha">
          <form action={atualizarSenha} className="form-stack">
            <div>
              <label htmlFor="senhaAtual" className="form-label">
                Senha atual
              </label>
              <input id="senhaAtual" name="senhaAtual" type="password" className="form-control" required />
            </div>

            <div>
              <label htmlFor="novaSenha" className="form-label">
                Nova senha
              </label>
              <input id="novaSenha" name="novaSenha" type="password" className="form-control" required />
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
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                atualizar senha
              </button>
              <button type="reset" className="btn btn-outline-secondary">
                limpar
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  )
}
