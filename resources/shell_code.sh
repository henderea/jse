function __jse_check {
  if command which jse >/dev/null 2>/dev/null; then
    return 0
  elif which nvm >/dev/null 2>/dev/null; then
    if which nvm_find_nvmrc >/dev/null 2>/dev/null; then
      if [[ -f "$(nvm_find_nvmrc)" ]]; then
        nvm use >/dev/null 2>/dev/null
      else
        nvm use default >/dev/null 2>/dev/null
      fi
    else
      nvm use default >/dev/null 2>/dev/null
      nvm use >/dev/null 2>/dev/null
    fi
    if command which jse >/dev/null 2>/dev/null; then
      return 0
    else
      return 1
    fi
  else
    return 1
  fi
}

function jvg {
  jse var get "$1" 2>/dev/null || return $?
}

function jvgl {
  jse var get --lines "$1" 2>/dev/null || return $?
}

function jvge {
  jse var get --escaped "$1" 2>/dev/null || return $?
}

function jvgeu {
  jse var get-all --escaped --unique --sort $@ 2>/dev/null || return $?
}

function jva {
  printf "> jse var add $*\n"
  jse var add $@ || return $?
}

function jvm {
  printf "> jse var mod $*\n"
  jse var mod $@
}

function jse {
  if ! __jse_check >/dev/null 2>/dev/null; then
    printf "$(tput bold)$(tput setaf 1)Unable to find jse script$(tput sgr0)\n"
    return 1
  fi
  if [[ "$1" == 'reload' ]]; then
    printf "$(tput dim)Reloading jse shell integration$(tput sgr0)\n" >&2
    eval "$(command jse shell)"
  else
    if [[ "$(command jse shell --revision)" != '!!JSE_SHELL_REVISION!!' ]]; then
      eval "$(command jse shell)"
    fi
    command jse $@
    return $?
  fi
}
