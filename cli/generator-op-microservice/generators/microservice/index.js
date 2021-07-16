'use strict';
const Generator = require( 'yeoman-generator' );
const chalk = require( 'chalk' );
const yosay = require( 'yosay' );
const fs = require( 'fs' );
const _ = require( 'lodash' );
const mkdirp = require( 'mkdirp' );
const packageJson = require( '../../package.json' );

let graphqlSupport;
let dbSupport;

module.exports = class extends Generator {
  prompting () {
    // Have Yeoman greet the user.
    this.log(
      yosay( `Welcome to the One Platform Microservice generator ${ chalk.red( 'generator-op-microservice' ) }!` )
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your microservice name'
      },
      {
        type: 'list',
        name: 'type',
        message: 'Which type of API do you want to create?',
        choices: [
          {
            name: 'GraphQL',
            value: 'graphql'
          },
          {
            name: 'REST',
            value: 'rest'
          }
        ],
        default: this.options.type,
        when: () => !this.options.type
      },
      {
        type: 'confirm',
        name: 'dbSupport',
        message: 'Are you going to use MongoDB?',
        default: true
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Author name',
        default: this.user.git.name()
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Author Email',
        default: this.user.git.email()
      }
    ];
    return this.prompt( prompts ).then( answers => {
      this.props = answers;
      const hyphenatedName = answers.name.indexOf( ' ' ) !== -1 ? answers.name.replace( /\s+/g, '-' ).toLowerCase() : answers.name;
      const underscoredName = answers.name.indexOf( ' ' ) !== -1 ? answers.name.replace( /\s+/g, '_' ).toUpperCase() : answers.name.toUpperCase();
      const capitalizedName = _
        .chain( answers.name )
        .camelCase()
        .upperFirst()
        .value();
      const { version: serviceVersion } = fs.existsSync(
        this.destinationPath( './package.json' )
      )
        ? require( this.destinationPath( './package.json' ) )
        : '';

      graphqlSupport = this.options.type === 'graphql' || answers.type === 'graphql';
      dbSupport = answers.dbSupport;
      const packageName = graphqlSupport ? `${ hyphenatedName }-service` : `${ hyphenatedName }-integration`;
      this.props = {
        authorName: answers.authorName,
        authorEmail: answers.authorEmail,
        name: answers.name,
        serviceName: hyphenatedName,
        serviceClassName: capitalizedName,
        typeName: `${ capitalizedName }Type`,
        typeDefName: `typeDef${ capitalizedName }`,
        resolverName: `${ capitalizedName }Resolver`,
        apiName: `${ capitalizedName }API`,
        apiPathName: hyphenatedName,
        lowerCaseName: hyphenatedName,
        camelCaseName: _.camelCase( answers.name ),
        underscoredName: underscoredName,
        packageName: packageName,
        generatorOPMicroserviceVersion: packageJson.version,
        serviceVersion,
        graphqlSupport: graphqlSupport,
        dbSupport: dbSupport
      };

      mkdirp.sync( this.props.packageName );

    } );
  }

  writing () {
    if ( fs.existsSync( this.templatePath( 'package.json' ) ) ) {
      this.fs.copyTpl(
        this.templatePath( 'package.json' ),
        this.destinationPath( `${ this.props.packageName }/package.json` ),
        this.props
      );
    }

    if ( graphqlSupport ) {

      if ( fs.existsSync( this.templatePath( 'gql.service.ts' ) ) ) {
        this.fs.copyTpl(
          this.templatePath( 'gql.service.ts' ),
          this.destinationPath(
            `${ this.props.packageName }/service.ts`
          ),
          this.props
        );
      }

      if ( fs.existsSync( this.templatePath( 'src/resolver.ts' ) ) ) {
        this.fs.copyTpl(
          this.templatePath( 'src/resolver.ts' ),
          this.destinationPath(
            `${ this.props.packageName }/src/resolver.ts`
          ),
          this.props
        );
      }

      if ( fs.existsSync( this.templatePath( 'src/typedef.graphql' ) ) ) {
        this.fs.copyTpl(
          this.templatePath( 'src/typedef.graphql' ),
          this.destinationPath(
            `${ this.props.packageName }/src/typedef.graphql`
          ),
          this.props
        );
      }

      if ( fs.existsSync( this.templatePath( 'src/e2e/gql.service.spec.ts' ) ) ) {
        this.fs.copyTpl(
          this.templatePath( 'src/e2e/gql.service.spec.ts' ),
          this.destinationPath(
            `${ this.props.packageName }/src/e2e/${ this.props.serviceName }.spec.ts`
          ),
          this.props
        );
      }
    } else {

      if ( fs.existsSync( this.templatePath( 'bin/rest.www.js' ) ) ) {
        this.fs.copyTpl(
          this.templatePath( 'bin/rest.www.js' ),
          this.destinationPath( `${ this.props.packageName }/bin/www.js` ),
          this.props
        );
      }

      if ( fs.existsSync( this.templatePath( 'rest.service.ts' ) ) ) {
        this.fs.copyTpl(
          this.templatePath( 'rest.service.ts' ),
          this.destinationPath(
            `${ this.props.packageName }/service.ts`
          ),
          this.props
        );
      }

      if ( fs.existsSync( this.templatePath( 'src/api.ts' ) ) ) {
        this.fs.copyTpl(
          this.templatePath( 'src/api.ts' ),
          this.destinationPath(
            `${ this.props.packageName }/src/api.ts`
          ),
          this.props
        );
      }

      if ( fs.existsSync( this.templatePath( 'src/e2e/rest.service.spec.ts' ) ) ) {
        this.fs.copyTpl(
          this.templatePath( 'src/e2e/rest.service.spec.ts' ),
          this.destinationPath(
            `${ this.props.packageName }/src/e2e/${ this.props.serviceName }.spec.ts`
          ),
          this.props
        );
      }
    }

    if ( fs.existsSync( this.templatePath( 'src/types.d.ts' ) ) ) {
      this.fs.copyTpl(
        this.templatePath( 'src/types.d.ts' ),
        this.destinationPath(
          `${ this.props.packageName }/src/types.d.ts`
        ),
        this.props
      );
    }
    if ( dbSupport ) {
      if ( fs.existsSync( this.templatePath( 'src/schema.ts' ) ) ) {
        this.fs.copyTpl(
          this.templatePath( 'src/schema.ts' ),
          this.destinationPath(
            `${ this.props.packageName }/src/schema.ts`
          ),
          this.props
        );
      }
    }
    if ( fs.existsSync( this.templatePath( 'src/helpers.ts' ) ) ) {
      this.fs.copy(
        this.templatePath( 'src/helpers.ts' ),
        this.destinationPath(
          `${ this.props.packageName }/src/helpers.ts`
        )
      );
    }
    if ( fs.existsSync( this.templatePath( 'src/config/config.ts' ) ) ) {
      this.fs.copyTpl(
        this.templatePath( 'src/config/config.ts' ),
        this.destinationPath(
          `${ this.props.packageName }/src/config/config.ts`
        ),
        this.props
      );
    }

    if ( fs.existsSync( this.templatePath( 'README.md' ) ) ) {
      this.fs.copyTpl(
        this.templatePath( 'README.md' ),
        this.destinationPath( `${ this.props.packageName }/README.md` ),
        this.props
      );
    }

    if ( fs.existsSync( this.templatePath( 'LICENSE.txt' ) ) ) {
      this.fs.copy(
        this.templatePath( 'LICENSE.txt' ),
        this.destinationPath( `${ this.props.packageName }/LICENSE.txt` )
      );
    }

    if ( fs.existsSync( this.templatePath( 'tsconfig.json' ) ) ) {
      this.fs.copy(
        this.templatePath( 'tsconfig.json' ),
        this.destinationPath( `${ this.props.packageName }/tsconfig.json` )
      );
    }

    if ( fs.existsSync( this.templatePath( 'tslint.json' ) ) ) {
      this.fs.copy(
        this.templatePath( 'tslint.json' ),
        this.destinationPath( `${ this.props.packageName }/tslint.json` )
      );
    }

    // .env config with example script
    if ( fs.existsSync( this.templatePath( '.env.example' ) ) ) {
      this.fs.copyTpl(
        this.templatePath( '.env.example' ),
        this.destinationPath( `${ this.props.packageName }/.env` ),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath( '.env.example' ),
        this.destinationPath( `${ this.props.packageName }/.env.example` ),
        this.props
      );
    }

    // e2e configuration files

    if ( fs.existsSync( this.templatePath( 'src/e2e/.test.env.example' ) ) ) {
      this.fs.copyTpl(
        this.templatePath( 'src/e2e/.test.env.example' ),
        this.destinationPath( `${ this.props.packageName }/src/e2e/.test.env` ),
        this.props
      );
    }

    if ( fs.existsSync( this.templatePath( 'jest.config.js' ) ) ) {
      this.fs.copyTpl(
        this.templatePath( 'jest.config.js' ),
        this.destinationPath( `${ this.props.packageName }/jest.config.js` ),
        this.props
      );
    }
    if ( fs.existsSync( this.templatePath( 'src/e2e/mock.json' ) ) ) {
      this.fs.copy(
        this.templatePath( 'src/e2e/mock.json' ),
        this.destinationPath( `${ this.props.packageName }/src/e2e/mock.json` )
      );
    }

    this.fs.copy(
      this.templatePath( 'webpack.*' ),
      this.destinationPath( `${ this.props.packageName }/` )
    );

    this.fs.copy(
      this.templatePath( ".gitignore" ),
      this.destinationPath( `${ this.props.packageName }/.gitignore` )
    );

    if ( fs.existsSync( this.templatePath( '.dockerignore' ) ) ) {
      this.fs.copy(
        this.templatePath( '.dockerignore' ),
        this.destinationPath( `${ this.props.packageName }/.dockerignore` )
      );
    }

    if ( fs.existsSync( this.templatePath( 'Dockerfile' ) ) ) {
      this.fs.copyTpl(
        this.templatePath( 'Dockerfile' ),
        this.destinationPath( `${ this.props.packageName }/Dockerfile` ),
        this.props
      );
    }
  }

  install () {
    process.chdir( this.props.packageName );

    this.installDependencies( {
      npm: true,
      bower: false,
      yarn: false
    } );
  }
};
