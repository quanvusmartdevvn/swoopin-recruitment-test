import React from 'react'

import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

import state from 'state'

import SEO from 'components/layout/seo'
import { logoSwoopin } from 'resources/logo'

import { FaEye, FaEyeSlash } from 'components/shared/icons'
import { Form, Button } from 'components/shared/inputs'

import './login.scss'

@observer
export default class PageLogin extends React.Component {
    @observable error: String | null = null

    @observable login = ''

    @observable password = ''

    @observable invalid = false

    @observable showPassword = false

    _update = {}

    @action.bound update(field) {
        this._update[field] = this._update[field] || (event => this.updateField(field, event.target.value))
        return this._update[field]
    }

    @action.bound updateField(field, value) {
        
        this[field] = value
    }

  

    @action.bound
    async connect(e) {
        e.preventDefault()

        const { connect, updateToken } = state.session

        try {

            let response:any = await connect({
                login: this.login,
                password: this.password,
            })
            updateToken(response.data.token);


        } catch (error) {
            
            if (error.message === 'user_not_found') {
                this.updateField('error', 'Utilisateur inconnu')
                this.updateField('invalid', true)
            }
            else if (error.message === 'wrong_credentials') {
                this.updateField('error', 'Utilisateur et/ou mot de passe invalide')
                this.updateField('invalid', true)
            }
            else if (error.message === 'wrong_credentials') {
                this.updateField('error', 'Utilisateur et/ou mot de passe invalide')
                this.updateField('invalid', true)
            }
            else if (error.message === 'internal_error') {
                this.updateField('error', 'Erreur interne')
            }
        }
    }

    render() {
        return (
            <Form className="login" onSubmit={this.connect}>
                <SEO
                    title='Strings.title'
                />
                <img
                    alt="logoSwoopin"
                    src={logoSwoopin}
                    className="logo"
                />

                <h1 className="title">
                    Backoffice
                </h1>

                {/*
                <p className="description">
                    Strings.description
                </p>*/}

                <label className="form-entry" htmlFor="email">
                    Email
                    <Form.Control
                        id="email"
                        value={this.login}
                        onChange={this.update('login')}
                        type="text"
                        className={this.invalid ? 'invalid' : ''}
                        placeholder='john.doe@email.com'
                        onFocus={() => this.updateField('invalid', false)}
                    />
                </label>

                <label className="form-entry password" htmlFor="password">
                    Mot de passe
                    <Form.Control
                        id="password"
                        value={this.password}
                        onChange={this.update('password')}
                        type={this.showPassword ? 'text' : 'password'}
                        placeholder=''
                        className={this.invalid ? 'invalid' : ''}
                        onFocus={() => this.updateField('invalid', false)}
                    />

                    <Button className="show-password" onClick={() => this.showPassword = !this.showPassword}>
                        { this.showPassword ? <FaEyeSlash /> : <FaEye /> }
                    </Button>
                </label>

                {
                    this.error && (
                        <div className="error">
                            {this.error}
                        </div>
                    )
                }

                <div className="action-line">
                    <label className="rememberMe" htmlFor="rememberMe" />

                </div>
                <div className="buttons">
                    <Button
                        disabled={!this.login || !this.password}
                        type="submit"
                        variant="primary"
                        onClick={ async (e) =>{ this.connect(e)}}
                    >
                        Se connecter
                    </Button>
                </div>
            </Form>
        )
    }
}
