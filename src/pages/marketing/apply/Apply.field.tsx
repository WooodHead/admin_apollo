import * as React from 'react';
import { Input, Tag, Select } from 'antd';
import { moneyPattern } from '../../../utils/formRule';
import LinkComponent from '../../components/link/LinkComponent';
import withLocale from '../../../utils/withLocale';
import Apply from './Apply';
import { ApplyItem, ApplyItemFragment } from './Apply.model';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableActionComponent from '../../components/table/TableActionComponent';
import QuickDateComponent from '../../components/date/QuickDateComponent';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { PureComponent } from 'react';
import ApolloClient from 'apollo-client/ApolloClient';

const site = withLocale.site;

interface ActivityItem {
  id: number;
  name: string;
  title: string;

  [other: string]: string | number;
}

interface ActivityResult {
  data: ActivityItem[];
}

interface Activity {
  actives: ActivityResult;
}

/** 优惠字段 */
export default class ApplyField<T extends { client: ApolloClient<{}> }> extends TableFormField<T> {
  id = {
    edit: <input type="hidden" />,
    coupon: <input type="hidden" />,
    withdraw: <input type="hidden" />,
    table: notInTable
  };

  user_name = {
    title: site('用户名'),
    search: <Input />
  };

  level = {
    title: site('会员等级'),
    search: <Input />
  };

  active_name = {
    title: site('优惠活动名称')
  };

  active_title = {
    title: site('优惠活动标题'),
    search: ({ text, record, view, value, onChange }: FieldProps<string, ApplyItem, Apply>) => (
      <Query
        query={gql`
          query {
            actives @rest(type: "ActivityResult", path: "/actives?type=all") {
              data {
                id
                title
                name
              }
            }
          }
        `}
      >
        {({ data: { actives = { data: [] } } = {} }: ChildProps<{}, Activity, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {actives.data.map((active: { title: string; id: number }, i: number) => (
              <Select.Option key={i} value={String(active.id)}>
                {active.title}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    )
  };

  deposit_money = {
    title: site('存款')
  };

  pre_coupon_money = {
    title: site('原优惠金额'),
    // 修改优惠金额
    coupon: ({ text, record }: FieldProps<string, ApplyItem, Apply>) => {
      return <span>{record.coupon_money}</span>;
    },
    table: notInTable
  };

  coupon_money = {
    title: site('优惠金额'),
    // 修改优惠金额
    coupon: <Input />,
    rules: [
      { required: true, message: '请输入优惠金额' },
      { pattern: moneyPattern(), message: '请输入小数点后小于两位的正数' }
    ],
    table: ({ text, record, view }: FieldProps<string, ApplyItem, Apply>) => {
      return record.isTotalRow ? (
        text
      ) : (
        <span
          onClick={() => {
            this.setState({
              coupon: { visible: true, record }
            });
          }}
        >
          <Tag color="blue">{text}</Tag>
        </span>
      );
    }
  };

  pre_withdraw_require = {
    title: site('原取款条件'),
    // 修改取款条件
    withdraw: ({ text, record }: FieldProps<string, ApplyItem, Apply>) => (
      <span>{record.withdraw_require}</span>
    ),
    table: notInTable
  };

  withdraw_require = {
    title: site('取款条件'),
    withdraw: <Input />,
    rules: [
      { required: true, message: '请输入优惠金额' },
      { pattern: moneyPattern(), message: '请输入小数点后小于两位的正数' }
    ],
    table: ({ text, record, view }: FieldProps<string, ApplyItem, Apply>) => {
      return record.isTotalRow ? (
        text
      ) : (
        <span
          onClick={() => {
            this.setState({
              withdraw: { visible: true, record }
            });
          }}
        >
          <Tag color="blue">{text}</Tag>
        </span>
      );
    }
  };

  apply_detail = {
    title: site('申请详情'),
    table: ({ text, record, view }: FieldProps<string, ApplyItem, Apply>) =>
      record.isTotalRow ? (
        ''
      ) : (
        <a
          onClick={() => {
            this.setState({
              detail: { visible: true, record }
            });
          }}
        >
          详情
        </a>
      )
  };

  apply_time = {
    title: site('申请时间'),
    search: <QuickDateComponent />
  };

  process_time = {
    title: site('处理时间')
  };

  status = {
    title: site('状态'),
    table: ({ text }: FieldProps<string, ApplyItem, Apply>) => {
      const STATUS = {
        pending: <Tag className="audit-ing">{site('未处理')}</Tag>,
        rejected: <Tag className="audit-refused">{site('已拒绝')}</Tag>,
        pass: <Tag className="audit-ed">{site('已通过')}</Tag>
      };
      return <div>{STATUS[text]}</div>;
    }
  };

  memo = {
    title: site('备注'),
    edit: <Input.TextArea />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, ApplyItem, Apply>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/active/apply/status"
                    method: "PUT"
                    type: "StatusResult"
                  ) {
                  state
                  message
                }
              }
            `}
          >
            {(pass, { data }) => (
              <TableActionComponent>
                {record.status === 'pending' && (
                  <>
                    <LinkComponent
                      confirm={true}
                      onClick={() =>
                        pass({ variables: { body: { id: record.id, status: 'pass' } } })
                          .then(messageResult('status'))
                          .then((v: GqlResult<'status'>) => {
                            writeFragment(this.props.client, 'ApplyItem', {
                              id: record.id,
                              status: 'pass'
                            });
                            return v.data.status;
                          })
                      }
                    >
                      {site('通过')}
                    </LinkComponent>
                    <LinkComponent
                      confirm={true}
                      onClick={() =>
                        pass({ variables: { body: { id: record.id, status: 'rejected' } } })
                          .then(messageResult('status'))
                          .then((v: GqlResult<'status'>) => {
                            writeFragment(this.props.client, 'ApplyItem', {
                              id: record.id,
                              status: 'rejected'
                            });
                            return v.data.status;
                          })
                      }
                    >
                      {site('拒绝')}
                    </LinkComponent>
                  </>
                )}
                <LinkComponent
                  onClick={() => {
                    this.setState({
                      memo: { visible: true, record }
                    });
                  }}
                >
                  写备注
                </LinkComponent>
              </TableActionComponent>
            )}
          </Mutation>
        )
      );
    }
  };
  constructor(view: PureComponent<T>) {
    super(view);
  }
}
