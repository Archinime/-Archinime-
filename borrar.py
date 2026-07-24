#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Elimina archivos de un repositorio de GitHub en un solo commit usando la API.
Versión 2.0 - Automatiza detección por patrón y usa variable de entorno para el token.
"""

import os
import sys
import re
from github import Github, GithubException

# ===================================================
# CONFIGURACIÓN
# ===================================================

# Obtén el token desde la variable de entorno (más seguro)
TOKEN = os.environ.get("GITHUB_TOKEN")
if not TOKEN:
    print("❌ Error: No se encontró la variable de entorno GITHUB_TOKEN.")
    print("   Configúrala con: export GITHUB_TOKEN=ghp_tu_token")
    sys.exit(1)

REPO_NAME = "Archinime/-Archinime-"  # Cambia por el tuyo
BRANCH = "main"                       # Rama objetivo

# Define el patrón de archivos a eliminar (expresión regular)
# Ejemplo: cualquier archivo que contenga " (1)" antes de la extensión
PATRON = r"\(1\)\.[^.]+$"             # Detecta "(1).ext" al final

# Mensaje del commit
MENSAJE_COMMIT = "Eliminar archivos duplicados con (1) en el nombre"

# Si quieres eliminar archivos específicos (sobrescribe el patrón):
# FILES_TO_DELETE = ["video-player-core (1).js", "video-player (1).html"]
# En ese caso, comenta la variable PATRON y descomenta FILES_TO_DELETE

# ===================================================

def main():
    print("🔍 Conectando a GitHub...")
    g = Github(TOKEN)
    try:
        repo = g.get_repo(REPO_NAME)
        print(f"✅ Repositorio: {REPO_NAME}")
    except GithubException as e:
        print(f"❌ Error al acceder al repositorio: {e}")
        sys.exit(1)

    # Obtener referencia de la rama
    try:
        ref = repo.get_git_ref(f"heads/{BRANCH}")
        print(f"✅ Rama: {BRANCH}")
    except GithubException as e:
        print(f"❌ No se encontró la rama '{BRANCH}': {e}")
        sys.exit(1)

    # Obtener último commit y su árbol
    latest_commit = repo.get_git_commit(ref.object.sha)
    base_tree = latest_commit.tree
    print(f"✅ Último commit: {latest_commit.sha[:8]}")

    # Recorrer el árbol y seleccionar archivos a eliminar
    archivos_a_borrar = []
    archivos_conservar = []

    # Si se definió FILES_TO_DELETE, úsalo; si no, usa el patrón
    if 'FILES_TO_DELETE' in globals() and FILES_TO_DELETE:
        archivos_a_borrar_nombres = set(FILES_TO_DELETE)
        for elemento in base_tree.tree:
            if elemento.path in archivos_a_borrar_nombres:
                archivos_a_borrar.append(elemento)
            else:
                archivos_conservar.append(elemento)
    else:
        # Usar patrón regex
        patron_re = re.compile(PATRON)
        for elemento in base_tree.tree:
            # Solo archivos (no directorios) y que coincidan con el patrón
            if elemento.type == "blob" and patron_re.search(elemento.path):
                archivos_a_borrar.append(elemento)
                print(f"   🗑️  Coincide: {elemento.path}")
            else:
                archivos_conservar.append(elemento)

    if not archivos_a_borrar:
        print("⚠️  No se encontraron archivos que coincidan con el patrón.")
        print("   Revisa el patrón o la lista de archivos.")
        sys.exit(0)

    # Mostrar resumen
    print(f"\n📋 Se eliminarán {len(archivos_a_borrar)} archivos:")
    for archivo in archivos_a_borrar:
        print(f"   - {archivo.path}")

    # Confirmar acción
    respuesta = input("\n¿Continuar con la eliminación? (s/n): ").strip().lower()
    if respuesta != 's':
        print("❌ Operación cancelada.")
        sys.exit(0)

    # Crear nuevo árbol sin los archivos eliminados
    print("\n📦 Creando nuevo árbol...")
    try:
        nuevo_arbol = repo.create_git_tree(archivos_conservar, base_tree=base_tree)
    except GithubException as e:
        print(f"❌ Error al crear el árbol: {e}")
        sys.exit(1)

    # Crear commit
    print("📝 Creando commit...")
    try:
        nuevo_commit = repo.create_git_commit(
            MENSAJE_COMMIT,
            nuevo_arbol,
            [latest_commit]
        )
    except GithubException as e:
        print(f"❌ Error al crear el commit: {e}")
        sys.exit(1)

    # Actualizar la rama
    print("⬆️  Actualizando la rama...")
    try:
        ref.edit(nuevo_commit.sha)
    except GithubException as e:
        print(f"❌ Error al actualizar la rama: {e}")
        sys.exit(1)

    print("\n✅ ¡Operación completada con éxito!")
    print(f"   Commit: {nuevo_commit.sha[:8]}")
    print(f"   Archivos eliminados: {len(archivos_a_borrar)}")
    print(f"   Repositorio: {REPO_NAME}")
    print(f"   Rama: {BRANCH}")
    print("\n🔗 Ver en GitHub: https://github.com/" + REPO_NAME + "/commit/" + nuevo_commit.sha)

if __name__ == "__main__":
    main()