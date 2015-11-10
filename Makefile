#
# Vars
#

BIN = ./node_modules/.bin
.DEFAULT_GOAL := all

#
# Tasks
#

node_modules: package.json
	@npm install
	@touch node_modules

test: node_modules
	${BIN}/babel-node test/*.js

validate: node_modules
	@${BIN}/standard

clean:
	@rm -rf lib

build: clean
	@${BIN}/babel src --out-dir lib

all: validate test

#
# Phony
#

.PHONY: test validate clean build
