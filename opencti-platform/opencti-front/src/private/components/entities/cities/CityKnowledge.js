import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { compose } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import inject18n from '../../../../components/i18n';
import EntityStixRelations from '../../common/stix_core_relationships/EntityStixCoreRelationships';
import StixDomainObjectKnowledge from '../../common/stix_domain_objects/StixDomainObjectKnowledge';
import StixRelation from '../../common/stix_core_relationships/StixRelation';
import CityPopover from './CityPopover';
import CityKnowledgeBar from './CityKnowledgeBar';
import StixDomainObjectHeader from '../../common/stix_domain_objects/StixDomainObjectHeader';

const styles = () => ({
  container: {
    margin: 0,
    padding: '0 260px 0 0',
  },
});

class CityKnowledgeComponent extends Component {
  render() {
    const { classes, city } = this.props;
    const link = `/dashboard/entities/cities/${city.id}/knowledge`;
    return (
      <div className={classes.container}>
        <StixDomainObjectHeader
          stixDomainObject={city}
          PopoverComponent={<CityPopover />}
        />
        <CityKnowledgeBar cityId={city.id} />
        <Route
          exact
          path="/dashboard/entities/cities/:cityId/knowledge/relations/:relationId"
          render={(routeProps) => (
            <StixRelation
              entityId={city.id}
              paddingRight={true}
              {...routeProps}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/entities/cities/:cityId/knowledge/overview"
          render={(routeProps) => (
            <StixDomainObjectKnowledge
              stixDomainObjectId={city.id}
              stixDomainObjectType="city"
              {...routeProps}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/entities/cities/:cityId/knowledge/countries"
          render={(routeProps) => (
            <EntityStixRelations
              entityId={city.id}
              relationType="localization"
              targetEntityTypes={['Country']}
              entityLink={link}
              creationIsFrom={false}
              {...routeProps}
            />
          )}
        />
        <Route
          exact
          path="/dashboard/entities/cities/:cityId/knowledge/threats"
          render={(routeProps) => (
            <EntityStixRelations
              entityId={city.id}
              relationType="targets"
              targetEntityTypes={[
                'Country',
                'Threat-Actor',
                'Intrusion-Set',
                'Campaign',
                'Incident',
                'Malware',
              ]}
              entityLink={link}
              creationIsFrom={false}
              {...routeProps}
            />
          )}
        />
      </div>
    );
  }
}

CityKnowledgeComponent.propTypes = {
  city: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
};

const CityKnowledge = createFragmentContainer(CityKnowledgeComponent, {
  city: graphql`
    fragment CityKnowledge_city on City {
      id
      name
      alias
    }
  `,
});

export default compose(
  inject18n,
  withRouter,
  withStyles(styles),
)(CityKnowledge);
