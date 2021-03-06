import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz"
import { GlobalRole, MembershipRole, Organization, User } from "db"

// export type Role = "ADMIN" | "USER"
export type Role = MembershipRole | GlobalRole

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      roles: Array<Role>
      orgId: Organization["id"]
    }
  }
}
