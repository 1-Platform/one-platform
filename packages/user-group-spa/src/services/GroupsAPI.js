import FetchClient from './FetchClient';
import {
  addGroup,
  getGroupsBy,
  getGroupDetailsByCn,
  listGroups,
  updateGroup,
  deleteGroup,
} from './GqlQueries';

export default {
  listGroups () {
    return FetchClient( {
      query: listGroups
    } )
      .then(data => data.listGroups);
  },

  /**
   * Fetches group details by its ldapCommonName
   * @param {string} ldapCommonName
   */
  getGroupByCn ( ldapCommonName ) {
    return FetchClient( {
      query: getGroupsBy,
      variables: { selector: { ldapCommonName } }
    } )
      .then(data => data?.getGroupsBy[0] || null);
  },

  /**
   * Fetches group details and its members by ldapCommonName
   * @param {string} ldapCommonName
   */
  getGroupDetailsByCn ( ldapCommonName ) {
    return FetchClient( {
      query: getGroupDetailsByCn,
      variables: { ldapCommonName }
    } )
      .then( data => ( {
        ...data,
        group: data.group[ 0 ],
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
    const cleanedGroup = Object.create(group);
    delete cleanedGroup._id;

    return FetchClient( {
      query: updateGroup,
      variables: { id: group._id, cleanedGroup }
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

  searchGroups ( ldapCommonName ) {
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
