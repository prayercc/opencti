import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose, pathOr, take } from 'ramda';
import { Link } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { MoreVert } from '@material-ui/icons';
import { ShieldSearch } from 'mdi-material-ui';
import inject18n from '../../../../components/i18n';
import StixCoreRelationshipPopover from '../../common/stix_core_relationships/StixCoreRelationshipPopover';
import ItemPatternType from '../../../../components/ItemPatternType';
import StixObjectLabels from '../../common/stix_object/StixObjectLabels';
import ItemMarking from '../../../../components/ItemMarking';

const styles = (theme) => ({
  item: {
    paddingLeft: 10,
    height: 50,
  },
  itemIcon: {
    color: theme.palette.primary.main,
  },
  bodyItem: {
    height: 20,
    fontSize: 13,
    float: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemIconDisabled: {
    color: theme.palette.grey[700],
  },
  placeholder: {
    display: 'inline-block',
    height: '1em',
    backgroundColor: theme.palette.grey[700],
  },
});

class EntityIndicatorLineComponent extends Component {
  render() {
    const {
      nsd,
      classes,
      dataColumns,
      node,
      paginationOptions,
      entityLink,
    } = this.props;
    const link = `${entityLink}/relations/${node.id}`;
    return (
      <ListItem
        classes={{ root: classes.item }}
        divider={true}
        button={true}
        component={Link}
        to={link}
      >
        <ListItemIcon classes={{ root: classes.itemIcon }}>
          <ShieldSearch />
        </ListItemIcon>
        <ListItemText
          primary={
            <div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.toPatternType.width }}
              >
                <ItemPatternType
                  variant="inList"
                  label={node.to.pattern_type}
                />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.toName.width }}
              >
                {node.to.name}
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.labels.width }}
              >
                <StixObjectLabels variant="inList" labels={node.to.labels} />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.toValidFrom.width }}
              >
                {nsd(node.to.valid_from)}
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.toValidUntil.width }}
              >
                {nsd(node.to.valid_until)}
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.markingDefinitions.width }}
              >
                {take(
                  1,
                  pathOr([], ['markingDefinitions', 'edges'], node.to),
                ).map((markingDefinition) => (
                  <ItemMarking
                    key={markingDefinition.node.id}
                    variant="inList"
                    label={markingDefinition.node.definition}
                  />
                ))}
              </div>
            </div>
          }
        />
        <ListItemSecondaryAction>
          <StixCoreRelationshipPopover
            stixCoreRelationshipId={node.id}
            paginationOptions={paginationOptions}
            disabled={node.inferred}
          />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

EntityIndicatorLineComponent.propTypes = {
  dataColumns: PropTypes.object,
  entityLink: PropTypes.string,
  paginationOptions: PropTypes.object,
  node: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  nsd: PropTypes.func,
};

const EntityIndicatorLineFragment = createFragmentContainer(
  EntityIndicatorLineComponent,
  {
    node: graphql`
      fragment EntityIndicatorLine_node on StixCoreRelationship {
        id
        weight
        first_seen
        last_seen
        description
        inferred
        role_played
        to {
          ... on Indicator {
            id
            name
            main_observable_type
            pattern_type
            description
            valid_from
            valid_until
            score
            created
            markingDefinitions {
              edges {
                node {
                  id
                  definition
                }
              }
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
          }
        }
      }
    `,
  },
);

export const EntityIndicatorLine = compose(
  inject18n,
  withStyles(styles),
)(EntityIndicatorLineFragment);

class EntityIndicatorLineDummyComponent extends Component {
  render() {
    const { classes, dataColumns } = this.props;
    return (
      <ListItem classes={{ root: classes.item }} divider={true}>
        <ListItemIcon classes={{ root: classes.itemIconDisabled }}>
          <ShieldSearch />
        </ListItemIcon>
        <ListItemText
          primary={
            <div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.toPatternType.width }}
              >
                <div className="fakeItem" style={{ width: '80%' }} />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.toName.width }}
              >
                <div className="fakeItem" style={{ width: '80%' }} />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.labels.width }}
              >
                <div className="fakeItem" style={{ width: '80%' }} />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.toValidFrom.width }}
              >
                <div className="fakeItem" style={{ width: '80%' }} />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.toValidUntil.width }}
              >
                <div className="fakeItem" style={{ width: '80%' }} />
              </div>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.markingDefinitions.width }}
              >
                <div className="fakeItem" style={{ width: 80 }} />
              </div>
            </div>
          }
        />
        <ListItemSecondaryAction classes={{ root: classes.itemIconDisabled }}>
          <MoreVert />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

EntityIndicatorLineDummyComponent.propTypes = {
  classes: PropTypes.object,
  dataColumns: PropTypes.object,
};

export const EntityIndicatorLineDummy = compose(
  inject18n,
  withStyles(styles),
)(EntityIndicatorLineDummyComponent);
