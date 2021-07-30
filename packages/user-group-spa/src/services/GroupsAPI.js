import FetchClient from './FetchClient';
import {
  addGroup,
  getGroupsBy,
  getGroupDetailsByCn,
  listGroups,
  updateGroup,
  deleteGroup,
} from './GqlQueries';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  listGroups () {
    return FetchClient( {
      query: listGroups
    } )
      .then(data => data.listGroups);
  },

  /**
   * Fetches group details by its cn
   * @param {string} cn
   */
  getGroupByCn ( cn ) {
    return FetchClient( {
      query: getGroupsBy,
      variables: { selector: { cn } }
    } )
      .then(data => data?.getGroupsBy[0] || null);
  },

  /**
   * Fetches group details and its members by cn
   * @param {string} cn
   */
  getGroupDetailsByCn ( cn ) {
    return FetchClient( {
      query: getGroupDetailsByCn,
      variables: { cn }
    } )
      .then( data => ( {
        ...data,
        group: data.group,
        members: data.members
      } ) );
  },

  addGroup ( group ) {
    return FetchClient( {
      query: addGroup,
      variables: { group },
    } )
      .then(data => data.addGroup);
  },

  updateGroup ( group ) {
    const cleanedGroup = { cn: group.cn, name: group.name };
    return FetchClient( {
      query: updateGroup,
      variables: { id: group._id, group: cleanedGroup }
    } )
      .then( data => data.updateGroup );
  },

  deleteGroup ( id ) {
    return FetchClient( {
      query: deleteGroup,
      variables: { id },
    } )
      .then( data => data.deleteGroup );
  },

  searchGroups ( cn ) {
    return new Promise( resolve => {
      setTimeout( () => {
        resolve( [
          { cn: 'one-portal-devel', members: [ { uid: 'mdeshmuk', name: 'Mayur Deshmukh' } ] },
          {
            cn: 'dsal-adm', members: [
              { uid: 'mdeshmuk', name: 'Mayur Deshmukh' },
              { uid: 'denair', name: 'Deepesh Nair' },
            ]
          },
        ] );
      }, 2000 );
    } );
  },
};
