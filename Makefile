# Builds a distribution directory
# Closure compiler requires at least JRE 6.0
BUILD_DIR = build
DIST_DIR = dist

JS = js
CSS = style
IMG = img
LIB = ${JS}/lib
MOD = ${JS}/mod
JS_DIR = ${DIST_DIR}/${JS}
CSS_DIR = ${DIST_DIR}/${CSS}
IMG_DIR = ${CSS_DIR}/${IMG}

	
JS_LIB_FILES = ${LIB}/jquery-1.4.2.min.js

JS_MOD_FILES = ${MOD}/ts.Keyboard.js \
	${MOD}/ts.LocalDataProxy.js \
	${MOD}/ts.PageHandler.js \
	${MOD}/ts.StatCounter.js \
	${MOD}/ts.String.js \
	${MOD}/ts.Test.js \
	${MOD}/ts.Timer.js

JS_INIT = ${JS}/ts.init.js
JS_UI = ${JS}/ts.ui.js

JS_COMPILE_FILES = ${JS_INIT} \
	${JS_MOD_FILES} \
	${JS_UI}
	
FILES =  js/jquery-1.4.2.min.js\
	js/ts.ui.js
	
JS_FILE = ts.ui.js
JS_OUTPUT = ${JS_DIR}/${JS_FILE}
JS_PATH = ${JS}/${JS_FILE}

CLOSURE_COMPILER = ${BUILD_DIR}/google-compiler-20100917.jar
MINJAR ?= java -jar ${CLOSURE_COMPILER}

define copy_files
	@@for file in ${1}/*; do \
		echo "$${file}" ; \
		cp "$${file}" ${2}"/$${file}" ; \
	done;
endef

all : init index style js
	@@ echo "Build complete"

init:
	@@ echo "Initiating build..."
	@@ if (test -d ${DIST_DIR}) then \
		echo "Backing up previous build---" ; \
		mv ${DIST_DIR} ${DIST_DIR}.old ; \
	fi
	@@ mkdir -p ${DIST_DIR}
	@@ mkdir -p ${JS_DIR}
	@@ mkdir -p ${CSS_DIR}
	@@ mkdir -p ${IMG_DIR}

index: ${DIST_DIR}
	@@ echo "Preparing index page..."
	@@ cp index.html ${DIST_DIR}/index.html
	@@ sed -i '/<script.*>.*<\/script>.*/d' ${DIST_DIR}/index.html
	@@ sed -i "s~</html>~<script type=\"text/javascript\" src=\"$(JS_PATH)\"></script>\n</html>~" ${DIST_DIR}/index.html

style: ${DIST_DIR}

	@@ echo "Copying css files..."
	@@ for file in ${CSS}/*.css; do \
		cp "$${file}" ${DIST_DIR}"/$${file}" ; \
	done;
	@@ echo "Copying images..."
	@@ for file in ${CSS}/${IMG}/*; do \
		cp "$${file}" ${DIST_DIR}"/$${file}" ; \
	done;

js: ${DIST_DIR}
	@@ echo "Compiling js modules..."
	@@ cat ${JS_COMPILE_FILES} | \
		sed 's/[^a-zA-Z0-9-]log(.*)\;*//g' | \
		sed 's/^log(.*)\;*//g' \
		> ${JS_OUTPUT}
	@@ echo "Minifying js..."
	@@ ${MINJAR} --js ${JS_OUTPUT} --warning_level QUIET --js_output_file ${JS_OUTPUT}.tmp
	@@ echo "Adding dependencies..."
	@@ cat ${JS_LIB_FILES} ${JS_OUTPUT}.tmp > ${JS_OUTPUT}
	@@ rm -f ${JS_OUTPUT}.tmp


