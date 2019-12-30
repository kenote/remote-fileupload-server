
all: install

clear:
	@rm -rf build
	@rm -rf uploadfiles
	@rm -rf node_modules
	@rm -rf pagkage-lock.json
	@rm -rf yarn-error.log
	@rm -rf yarn.lock

install:
	@npm set registry https://registry.npm.taobao.org
	@npm install
	@npm audit fix

reinstall:
	@make clear
	@make install
	
update:
	@npm set registry https://registry.npm.taobao.org
	@npm update

clearlogs:
	@rm -rf logs