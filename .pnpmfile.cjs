module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === 'eslint-config-react-app') {
        // 确保依赖被正确解析
        pkg.dependencies = pkg.dependencies || {}
      }
      return pkg
    }
  }
}