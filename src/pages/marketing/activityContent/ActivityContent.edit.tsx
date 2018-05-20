import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import withLocale from '../../../utils/withLocale';
import { ActivityApplyItem } from '../activityApply/ActivityApply.model';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { EditFormComponent, EditFormConfig } from '../../components/form/EditFormComponent';
import { ActivityContentItem } from './ActivityContent.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
  edit: { visible: boolean; record: ActivityContentItem };
  editFields: EditFormConfig[];
  onDone: () => void;
  modalTitle: string;
  modalOk: string;
}

/** ActivityContentEdit */
@withLocale
@compose(withApollo)
export default class ActivityContentEdit extends React.PureComponent<Props, {}> {
  state = {};

  render(): React.ReactNode {
    const { site = () => '', client } = this.props as Hoc;
    return (
      <Mutation
        mutation={gql`
          mutation editMutation($body: ActivityEditInput!, $id: Int!) {
            edit(body: $body, id: $id)
              @rest(
                bodyKey: "body"
                path: "/active/manual/:id"
                method: "put"
                type: "ActivityEditResult"
              ) {
              state
              message
            }
          }
        `}
      >
        {edit => (
          <EditFormComponent
            size="large"
            fieldConfig={this.props.editFields}
            modalTitle={this.props.modalTitle}
            modalOk={this.props.modalOk}
            modalVisible={this.props.edit.visible}
            onCancel={() => {
              this.props.onDone();
            }}
            onSubmit={(values: ActivityApplyItem) => {
              return edit({ variables: { body: values, id: values.id } }).then(
                (v: GqlResult<'edit'>) => {
                  writeFragment(client, 'ActivityContentItem', values);
                  this.props.onDone();
                  return v.data && v.data.edit;
                }
              );
            }}
            values={this.props.edit.record}
            view={this}
          />
        )}
      </Mutation>
    );
  }
}