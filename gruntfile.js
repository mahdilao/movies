module.exports = function(grunt) {

	grunt.initConfig({
		// pkg: grunt.file.readJOSN('packagr.json'),
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				// 检测语法错误
				// tasks: ['jshint'], 
				options: {
					livereload: true
				}
			}
		},
		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					args: ['dev'],
					nodeArgs: ['--debug'],
					ignore: ['README.md', 'node_modules/**', '.DS_Store'],
					ext: 'js',
					watch: ['./'],
					delay: 1000,
					env: {
						PORT: 3000
					},
					cwd: __dirname,
					legacyWatch: true
				}
			}
		},
		concurrent: {
			tasks: ['nodemon', 'watch'], // 同时执行 nodemon 与 watch
			options: {
				logConcurrentOutput: true
			}
		}
	})

	// 当执行添删改查任务时，执行其中申明的事件
	grunt.loadNpmTasks('grunt-contrib-watch')
		// 实时监听入口文件，并重启服务
	grunt.loadNpmTasks('grunt-nodemon')
		// 优化慢任务执行时间，并可跑多个事件
	grunt.loadNpmTasks('grunt-concurrent')

	// 监听异常，并抛出
	grunt.option('force', true)
		// 注册一个默认任务 concurrent
	grunt.registerTask('default', ['concurrent'])
}