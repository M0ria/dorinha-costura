import { RepositoryToken } from './RepositoryToken';

export class DIContainer {
  private static registry = new Map<RepositoryToken, any>();

  public static register<T>(token: RepositoryToken, implementation: T): void {
    this.registry.set(token, implementation);
  }

  public static get<T>(token: RepositoryToken): T {
    const implementation = this.registry.get(token);
    if (!implementation) {
      throw new Error(`Injeção de dependência falhou: Nenhuma implementação registrada para o token [${token}]`);
    }
    return implementation;
  }

  public static clear(): void {
    this.registry.clear();
  }
}
export default DIContainer;
