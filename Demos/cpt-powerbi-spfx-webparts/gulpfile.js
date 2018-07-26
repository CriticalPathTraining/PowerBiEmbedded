'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
      if (build.getConfig().production) {
          var basePath = build.writeManifests.taskConfig.cdnBasePath;
          if (!basePath.endsWith('/')) {
              basePath += '/';
          }
          generatedConfiguration.output.publicPath = basePath;
      }
      else {
          generatedConfiguration.output.publicPath = "/dist/";
      }
      return generatedConfiguration;
  }
});

build.initialize(gulp);
