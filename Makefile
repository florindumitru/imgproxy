test:
	@./node_modules/.bin/mocha \
		--require should \
		--timeout 10000 \
		--reporter spec

component:
	@component install
	@component build

.PHONY: test