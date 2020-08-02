import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import Markdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import inject18n from '../../../../components/i18n';
import StixDomainObjectLabels from '../../common/stix_domain_objects/StixDomainObjectLabels';
import ItemCreator from '../../../../components/ItemCreator';

const styles = () => ({
  paper: {
    height: '100%',
    minHeight: '100%',
    margin: '10px 0 0 0',
    padding: '15px',
    borderRadius: 6,
  },
});

class XOpenCTIIncidentDetailsComponent extends Component {
  render() {
    const {
      fld, t, classes, xOpenCTIIncident,
    } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Typography variant="h4" gutterBottom={true}>
          {t('Details')}
        </Typography>
        <Paper classes={{ root: classes.paper }} elevation={2}>
          <StixDomainObjectLabels
            labels={xOpenCTIIncident.objectLabel}
            id={xOpenCTIIncident.id}
          />
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Creator')}
          </Typography>
          <ItemCreator creator={xOpenCTIIncident.creator} />
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('First seen')}
          </Typography>
          {fld(xOpenCTIIncident.first_seen)}
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Last seen')}
          </Typography>
          {fld(xOpenCTIIncident.last_seen)}
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Objective')}
          </Typography>
          <Markdown className="markdown" source={xOpenCTIIncident.objective} />
        </Paper>
      </div>
    );
  }
}

XOpenCTIIncidentDetailsComponent.propTypes = {
  xOpenCTIIncident: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  fld: PropTypes.func,
};

const XOpenCTIXOpenCTIIncidentDetails = createFragmentContainer(
  XOpenCTIIncidentDetailsComponent,
  {
    xOpenCTIIncident: graphql`
      fragment XOpenCTIIncidentDetails_xOpenCTIIncident on XOpenCTIIncident {
        id
        first_seen
        last_seen
        objective
        creator {
          id
          name
        }
        objectLabel {
          edges {
            node {
              id
              value
              color
            }
          }
        }
      }
    `,
  },
);

export default compose(
  inject18n,
  withStyles(styles),
)(XOpenCTIXOpenCTIIncidentDetails);
