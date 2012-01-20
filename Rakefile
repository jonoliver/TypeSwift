verbose false

build_dir = 'build'
dist_dir = 'dist'
old_dir = dist_dir + '.old'


js_dir = 'js'
style_dir = 'style'
img_dir = File.join(style_dir, 'img')

dist_js_dir = File.join(dist_dir, js_dir)
dist_style_dir = File.join(dist_dir, style_dir)
dist_img_dir = File.join(dist_dir, img_dir)

dirs_to_create = [
	dist_dir,
	dist_js_dir,
	dist_style_dir,
	dist_img_dir,
]

js_lib_files = %w{
	jquery-1.4.2
}.map { |js| File.join( 'js', 'lib', "#{js}.min.js" ) }

js_init = File.join( 'js', 'ts.init.js')
js_ui = File.join( 'js', 'ts.ui.js')

js_mod_files = %w{
	Keyboard
	LocalDataProxy
	PageHandler
	StatCounter
	String
	Test
	Timer
}.map { |js| File.join( 'js', 'mod', "ts.#{js}.js" ) }

new_index = dist_dir + '/index.html'
new_js = File.join(dist_dir, js_ui)


js_files = [js_init, js_mod_files, js_ui].flatten
minfier    = "java -jar #{build_dir}/google-compiler-20100917.jar"

real = [:init, new_index, new_js, :images, :cleanup]
task :default => [:init, new_index, new_js, :css, :images, :cleanup]

task :init do
	puts 'Initiating build...'
	
	# back up previous build
	if File.directory? dist_dir
		if File.directory? old_dir
			File.rename(old_dir, old_dir + '.tmp')
		end

		cp_r dist_dir, dist_dir + '.old'
	end

	#create missing directories
	dirs_to_create.each{|dir|
		add_dir dir
	}
end

desc "Creates index file, replaces script tags"
file new_index => 'index.html' do
	puts 'Creating index file...'
	# matches one line comments
	text = 	File.read('index.html').
		gsub(/<!--[^\[if](\s*).*-->.*\n/, '').
		gsub(/<script.*>.*<\/script>.*\n/, '').
		gsub("</body>", "<script type=\"text/javascript\" src=\"#{js_ui}\"></script>\n</body>")
	File.open(new_index, 'w') do |f|
    	f.puts text 
	end
end

desc "Builds and minifies js files"
file new_js => [js_files].flatten do
	puts "Building js modules..."
	File.open(new_js, 'w') do |f|
		f.write cat(js_files).
		  	gsub(/log\(.+\);*/, '')
	end

	puts "Minifying js..."
	sh "#{minfier} --js #{new_js} --warning_level QUIET --js_output_file #{new_js}.tmp"

	puts "Adding dependencies..."
	File.open(new_js, 'w') do |f|
		f.write cat([js_lib_files, "#{new_js}.tmp"].flatten)
	end
	rm_rf "#{new_js}.tmp"
end

desc "Copies styles"
task :css do
	puts "Copying styles..."
	Dir.foreach(style_dir) do |file|
  		next if file == '.' or file == '..'
		src = File.join(style_dir, file)
		target = File.join(dist_style_dir, file)
	  	cp_file target, src
	end
end

desc "Copies images"
task :images do
	puts "Copying images..."
	Dir.foreach(img_dir) do |file|
  		next if file == '.' or file == '..'
		src = File.join(img_dir, file)
		target = File.join(dist_img_dir, file)
	  	cp_file target, src
	end
end

desc "Deletes temp files"
task :cleanup do
	rm_rf old_dir + '.tmp'
	puts 'Build completed'
end

def add_dir(dir)
	if !File.directory? dir
		mkdir dir
	end
end

def cat( files )
  files.map do |file|
    File.read(file)
  end.join('')
end

def cp_file(target, src)
	if File.file? src
		unless uptodate?(target, src)
			copy_file src, target
		end
	end
end 
