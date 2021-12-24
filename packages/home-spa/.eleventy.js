module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/*.css');
  eleventyConfig.addPassthroughCopy('./src/static');
  eleventyConfig.addPassthroughCopy('./src/favicon.ico');
  return {
    dir: {
      input: "src",
      output: "dist",
    }
  }
}
