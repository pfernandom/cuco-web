import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

class PatientList extends React.Component {
  constructor() {
    super();
    this.state = {patients:[]}
  }
  componentDidMount() {
    fetch('http://localhost:8080/patient')
    .then(res => res.json())
    .then((data) => {
      this.setState({ patients: data })
    })
    .catch(console.log)
  }
  render() {
    const { patients } = this.state;
    return <ul>{patients.map(p => <li key={p._id}>{p.firstName}</li>)}</ul>
  }
};


class PatientForm extends React.Component {
  constructor() {
    super();
    this.state = {patients:[]}
  }
  createUser(ev) {
    ev.preventDefault();
    const body = {
      firstName: 'Pedro',
    }
    fetch('http://localhost:8080/patient', {
      method: 'post',
      body: JSON.stringify(body)
    })
  }
  render() {
    const { patients } = this.state;
    return <form onSubmit={this.createUser.bind(this)}>
      <label>Nombre: <input name="firstName"/></label>
      <button type="submit">Create</button>
    </form>
  }
};


const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Consultorio</h1>
    <h2>Pacientes</h2>
    <PatientList></PatientList>
    <h2>Create paciente</h2>
    <PatientList/>
    <PatientForm/>
  </Layout>
)

export default IndexPage
