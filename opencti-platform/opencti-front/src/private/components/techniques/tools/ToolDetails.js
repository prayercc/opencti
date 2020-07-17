import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Launch } from '@material-ui/icons';
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

class ToolDetailsComponent extends Component {
  render() {
    const { t, classes, tool } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Typography variant="h4" gutterBottom={true}>
          {t('Details')}
        </Typography>
        <Paper classes={{ root: classes.paper }} elevation={2}>
          <StixDomainObjectLabels labels={tool.labels} id={tool.id} />
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Creator')}
          </Typography>
          <ItemCreator creator={tool.creator} />
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Kill chain phases')}
          </Typography>
          <List>
            {tool.killChainPhases.edges.map((killChainPhaseEdge) => {
              const killChainPhase = killChainPhaseEdge.node;
              return (
                <ListItem
                  key={killChainPhase.phase_name}
                  dense={true}
                  divider={true}
                >
                  <ListItemIcon>
                    <Launch />
                  </ListItemIcon>
                  <ListItemText primary={killChainPhase.phase_name} />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </div>
    );
  }
}

ToolDetailsComponent.propTypes = {
  tool: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  fld: PropTypes.func,
};

const ToolDetails = createFragmentContainer(ToolDetailsComponent, {
  tool: graphql`
    fragment ToolDetails_tool on Tool {
      id
      creator {
          id
          name
        }
      labels {
        edges {
          node {
            id
            label_type
            value
            color
          }
          relation {
            id
          }
        }
      }
      killChainPhases {
        edges {
          node {
            id
            kill_chain_name
            phase_name
            phase_order
          }
        }
      }
    }
  `,
});

export default compose(inject18n, withStyles(styles))(ToolDetails);
