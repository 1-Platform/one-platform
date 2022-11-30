export default /* GraphQL */ `
  scalar ISODate

  directive @auth(requires: Role = USER) on OBJECT | FIELD_DEFINITION

  enum Role {
    ADMIN
    OWNER
    USER
  }

  input SortInput {
    field: String!
    order: Int!
  }
`;
