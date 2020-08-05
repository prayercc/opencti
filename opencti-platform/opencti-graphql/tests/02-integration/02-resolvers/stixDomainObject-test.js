import gql from 'graphql-tag';
import { queryAsAdmin } from '../../utils/testQuery';

const LIST_QUERY = gql`
  query stixDomainObjects(
    $first: Int
    $after: ID
    $orderBy: StixDomainObjectsOrdering
    $orderMode: OrderingMode
    $filters: [StixDomainObjectsFiltering]
    $filterMode: FilterMode
    $search: String
  ) {
    stixDomainObjects(
      first: $first
      after: $after
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
      filterMode: $filterMode
      search: $search
    ) {
      edges {
        node {
          id
          name
          description
        }
      }
    }
  }
`;

const READ_QUERY = gql`
  query stixDomainObject($id: String!) {
    stixDomainObject(id: $id) {
      id
      name
      description
      toStix
      editContext {
        focusOn
        name
      }
    }
  }
`;

describe('StixDomainObject resolver standard behavior', () => {
  let stixDomainObjectInternalId;
  let stixDomainObjectMarkingDefinitionRelationId;
  const stixDomainObjectStixId = 'report--34c9875d-8206-4f4b-bf17-f58d9cf7ebec';
  it('should stixDomainObject created', async () => {
    const CREATE_QUERY = gql`
      mutation StixDomainObjectAdd($input: StixDomainObjectAddInput) {
        stixDomainObjectAdd(input: $input) {
          id
          name
          description
          tags {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `;
    // Create the stixDomainObject
    const STIX_DOMAIN_ENTITY_TO_CREATE = {
      input: {
        name: 'StixDomainObject',
        type: 'Report',
        stix_id_key: stixDomainObjectStixId,
        description: 'StixDomainObject description',
        tags: ['ebd3398f-2189-4597-b994-5d1ab310d4bc', 'd2f32968-7e6a-4a78-b0d7-df4e9e30130c'],
      },
    };
    const stixDomainObject = await queryAsAdmin({
      query: CREATE_QUERY,
      variables: STIX_DOMAIN_ENTITY_TO_CREATE,
    });
    expect(stixDomainObject).not.toBeNull();
    expect(stixDomainObject.data.stixDomainObjectAdd).not.toBeNull();
    expect(stixDomainObject.data.stixDomainObjectAdd.name).toEqual('StixDomainObject');
    expect(stixDomainObject.data.stixDomainObjectAdd.tags.edges.length).toEqual(2);
    stixDomainObjectInternalId = stixDomainObject.data.stixDomainObjectAdd.id;
  });
  it('should stixDomainObject loaded by internal id', async () => {
    const queryResult = await queryAsAdmin({ query: READ_QUERY, variables: { id: stixDomainObjectInternalId } });
    expect(queryResult).not.toBeNull();
    expect(queryResult.data.stixDomainObject).not.toBeNull();
    expect(queryResult.data.stixDomainObject.id).toEqual(stixDomainObjectInternalId);
    expect(queryResult.data.stixDomainObject.toStix.length).toBeGreaterThan(5);
  });
  it('should stixDomainObject loaded by stix id', async () => {
    const queryResult = await queryAsAdmin({ query: READ_QUERY, variables: { id: stixDomainObjectStixId } });
    expect(queryResult).not.toBeNull();
    expect(queryResult.data.stixDomainObject).not.toBeNull();
    expect(queryResult.data.stixDomainObject.id).toEqual(stixDomainObjectInternalId);
  });
  it('should list stixDomainObjects', async () => {
    const queryResult = await queryAsAdmin({ query: LIST_QUERY, variables: { first: 10 } });
    expect(queryResult.data.stixDomainObjects.edges.length).toEqual(10);
  });
  it('should stixDomainObjects number to be accurate', async () => {
    const NUMBER_QUERY = gql`
      query stixDomainObjectsNumber {
        stixDomainObjectsNumber {
          total
        }
      }
    `;
    const queryResult = await queryAsAdmin({ query: NUMBER_QUERY });
    expect(queryResult.data.stixDomainObjectsNumber.total).toEqual(69);
  });
  it('should timeseries stixDomainObjects to be accurate', async () => {
    const TIMESERIES_QUERY = gql`
      query stixDomainObjectsTimeSeries(
        $type: String
        $field: String!
        $operation: StatsOperation!
        $startDate: DateTime!
        $endDate: DateTime!
        $interval: String!
      ) {
        stixDomainObjectsTimeSeries(
          type: $type
          field: $field
          operation: $operation
          startDate: $startDate
          endDate: $endDate
          interval: $interval
        ) {
          date
          value
        }
      }
    `;
    const queryResult = await queryAsAdmin({
      query: TIMESERIES_QUERY,
      variables: {
        field: 'created',
        operation: 'count',
        startDate: '2020-01-01T00:00:00+00:00',
        endDate: '2021-01-01T00:00:00+00:00',
        interval: 'month',
      },
    });
    expect(queryResult.data.stixDomainObjectsTimeSeries.length).toEqual(13);
    expect(queryResult.data.stixDomainObjectsTimeSeries[1].value).toEqual(12);
    expect(queryResult.data.stixDomainObjectsTimeSeries[2].value).toEqual(5);
  });
  it('should update stixDomainObject', async () => {
    const UPDATE_QUERY = gql`
      mutation StixDomainObjectEdit($id: ID!, $input: EditInput!) {
        stixDomainObjectEdit(id: $id) {
          fieldPatch(input: $input) {
            id
            name
          }
        }
      }
    `;
    const queryResult = await queryAsAdmin({
      query: UPDATE_QUERY,
      variables: { id: stixDomainObjectInternalId, input: { key: 'name', value: ['StixDomainObject - test'] } },
    });
    expect(queryResult.data.stixDomainObjectEdit.fieldPatch.name).toEqual('StixDomainObject - test');
  });
  it('should context patch stixDomainObject', async () => {
    const CONTEXT_PATCH_QUERY = gql`
      mutation StixDomainObjectEdit($id: ID!, $input: EditContext) {
        stixDomainObjectEdit(id: $id) {
          contextPatch(input: $input) {
            id
          }
        }
      }
    `;
    const queryResult = await queryAsAdmin({
      query: CONTEXT_PATCH_QUERY,
      variables: { id: stixDomainObjectInternalId, input: { focusOn: 'description' } },
    });
    expect(queryResult.data.stixDomainObjectEdit.contextPatch.id).toEqual(stixDomainObjectInternalId);
  });
  it('should stixDomainObject editContext to be accurate', async () => {
    const queryResult = await queryAsAdmin({ query: READ_QUERY, variables: { id: stixDomainObjectInternalId } });
    expect(queryResult).not.toBeNull();
    expect(queryResult.data.stixDomainObject).not.toBeNull();
    expect(queryResult.data.stixDomainObject.id).toEqual(stixDomainObjectInternalId);
    expect(queryResult.data.stixDomainObject.editContext[0].focusOn).toEqual('description');
  });
  it('should context clean stixDomainObject', async () => {
    const CONTEXT_PATCH_QUERY = gql`
      mutation StixDomainObjectEdit($id: ID!) {
        stixDomainObjectEdit(id: $id) {
          contextClean {
            id
          }
        }
      }
    `;
    const queryResult = await queryAsAdmin({
      query: CONTEXT_PATCH_QUERY,
      variables: { id: stixDomainObjectInternalId },
    });
    expect(queryResult.data.stixDomainObjectEdit.contextClean.id).toEqual(stixDomainObjectInternalId);
  });
  it('should add relation in stixDomainObject', async () => {
    const RELATION_ADD_QUERY = gql`
      mutation StixDomainObjectEdit($id: ID!, $input: RelationAddInput!) {
        stixDomainObjectEdit(id: $id) {
          relationAdd(input: $input) {
            id
            from {
              ... on StixDomainObject {
                markingDefinitions {
                  edges {
                    node {
                      id
                    }
                    relation {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    const queryResult = await queryAsAdmin({
      query: RELATION_ADD_QUERY,
      variables: {
        id: stixDomainObjectInternalId,
        input: {
          toId: '43f586bc-bcbc-43d1-ab46-43e5ab1a2c46',
          relationship_type: 'object-marking',
        },
      },
    });
    expect(queryResult.data.stixDomainObjectEdit.relationAdd.from.objectMarking.edges.length).toEqual(1);
    stixDomainObjectMarkingDefinitionRelationId =
      queryResult.data.stixDomainObjectEdit.relationAdd.from.objectMarking.edges[0].relation.id;
  });
  it('should delete relation in stixDomainObject', async () => {
    const RELATION_DELETE_QUERY = gql`
      mutation StixDomainObjectEdit($id: ID!, $relationId: ID!) {
        stixDomainObjectEdit(id: $id) {
          relationDelete(relationId: $relationId) {
            id
            markingDefinitions {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    `;
    const queryResult = await queryAsAdmin({
      query: RELATION_DELETE_QUERY,
      variables: {
        id: stixDomainObjectInternalId,
        relationId: stixDomainObjectMarkingDefinitionRelationId,
      },
    });
    expect(queryResult.data.stixDomainObjectEdit.relationDelete.objectMarking.edges.length).toEqual(0);
  });
  it('should delete relation with toId in stixDomainObject', async () => {
    const RELATION_TOID_DELETE_QUERY = gql`
      mutation StixDomainObjectEdit($id: ID!, $toId: String, $relationship_type: String) {
        stixDomainObjectEdit(id: $id) {
          relationDelete(toId: $toId, relationship_type: $relationship_type) {
            id
            tags {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    `;
    const queryResult = await queryAsAdmin({
      query: RELATION_TOID_DELETE_QUERY,
      variables: {
        id: stixDomainObjectInternalId,
        toId: 'ebd3398f-2189-4597-b994-5d1ab310d4bc',
        relationship_type: 'tagged',
      },
    });
    expect(queryResult.data.stixDomainObjectEdit.relationDelete.tags.edges.length).toEqual(1);
  });
  it('should stixDomainObject deleted', async () => {
    const DELETE_QUERY = gql`
      mutation stixDomainObjectDelete($id: ID!) {
        stixDomainObjectEdit(id: $id) {
          delete
        }
      }
    `;
    // Delete the stixDomainObject
    await queryAsAdmin({
      query: DELETE_QUERY,
      variables: { id: stixDomainObjectInternalId },
    });
    // Verify is no longer found
    const queryResult = await queryAsAdmin({ query: READ_QUERY, variables: { id: stixDomainObjectStixId } });
    expect(queryResult).not.toBeNull();
    expect(queryResult.data.stixDomainObject).toBeNull();
    // TODO Verify is no relations are linked to the deleted entity
  });
});