---
to: src/pages/<%= h.folder(name) %>.field.tsx
unless_exists: true
sh: prettier --print-width 100 --single-quote --trailing-commas all --parser typescript --write src/pages/<%= h.folder(name) %>.field.tsx
---
<% Page = h.Page(name); page = h.page(name) -%>
import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Tag, Select, Switch } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../utils/formRule';
import LinkComponent from '../../components/link/LinkComponent';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableActionComponent from '../../components/table/TableActionComponent';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import <%= Page %>Page from './<%= Page %>.page';
import { <%= Page %>, <%= Page %>Fragment } from './<%= Page %>.model';

const site = withLocale.site;

/** <%= Page %>字段 */
export default class <%= Page %>Field<T extends { client: ApolloClient<{}> }> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

<% h.fields().forEach(function(field){ -%>
  <%= field.dataIndex %> = {
    title: site('<%= field.title %>'),
    form: <% if (field.dataIndex === 'status') { -%> (
      <Switch
        checkedChildren={site('启用')}
        unCheckedChildren={site('停用')}
      />),
<% } else { -%>
<Input />,
<% } -%>
<% if (field.dataIndex === 'status') { -%>
    table: ({ text, record, view }: FieldProps<string, <%= Page %>, <%= Page %>Page>) => (
      <>
        {record.status === 'enabled' ? (
        <Tag className="account-opened">{site('启用')}</Tag>
        ) : (
        <Tag className="account-close">{site('停用')}</Tag>
        )}
      </>),
<% } -%>
  };

<% }) -%>
  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, <%= Page %>, <%= Page %>Page>) => {
      return (
        !record.isTotalRow && (
<% if (h.fields().map(v => v.dataIndex).includes('status') ) { -%>
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/<%= page %>/status"
                    method: "PUT"
                    type: "StatusResult"
                  ) {
                  state
                  message
                }
              }
            `}
          >
            {status => (
<% } -%>
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(
                    path: "/<%= page %>/:id"
                    method: "DELETE"
                    type: "RemoveResult"
                  ) {
                  state
                  message
                }
              }
            `}
            refetchQueries={['<%= page %>Query']}
          >
            {remove => (
              <TableActionComponent>
                <LinkComponent
                  confirm={true}
                  onClick={() =>
                    status({
                      variables: {
                        body: {
                          id: record.id,
                          status: record.status === 'enabled' ? 'disabled' : 'enabled'
                        }
                      }
                    })
                      .then(messageResult('status'))
                      .then((v: GqlResult<'status'>) => {
                        writeFragment(this.props.client, '<%= Page %>', {
                          id: record.id,
                          status: record.status === 'enabled' ? 'disabled' : 'enabled'
                        });
                        return v.data && v.data.status;
                      })
                  }
                >
                  {record.status === 'enabled' ? site('停用') : site('启用')}
                </LinkComponent>
                <LinkComponent
                  confirm={true}
                  onClick={() =>
                    remove({ variables: { id: record.id } })
                      .then(messageResult('remove'))
                      .then((v: GqlResult<'remove'>) => {
                        return v.data && v.data.remove;
                      })
                  }
                >
                  {site('删除')}
                </LinkComponent>
                <LinkComponent
                  onClick={() => {
                    this.setState({
                      edit: { visible: true, record }
                    });
                  }}
                >
                  编辑
                </LinkComponent>
              </TableActionComponent>
            )}
          </Mutation>
<% if (h.fields().map(v => v.dataIndex).includes('status') ) { -%>
            )}
          </Mutation>
<% } -%>
        )
      );
    }
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
