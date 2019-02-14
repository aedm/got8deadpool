import React from 'react';
import {Table} from 'react-bootstrap';

export function RuleTable() {
  return <Table className="rule-table">
    <tbody>
    <tr>
      <td className="rules-empty"/>
      <td colSpan="2">Your prediction</td>
    </tr>
    <tr>
      <td className="rules-empty"/>
      <td>Dies</td>
      <td>Survives</td>
    </tr>
    <tr>
      <td>Dies in the show</td>
      <td>2</td>
      <td>-1</td>
    </tr>
    <tr>
      <td>Survives in the show</td>
      <td>0</td>
      <td>1</td>
    </tr>
    </tbody>
  </Table>;
}