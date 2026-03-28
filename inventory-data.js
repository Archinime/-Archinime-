// inventory-data.js
export const defaultInventoryConfig = {
    piso: { 
        label: "Piso", emoji: "🟫", equipped: "base", 
        items: { 
            "base": { 
                name: "Piso Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/piso.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/piso_estandar.avif"
            } 
        } 
    },
    paredes: { 
        label: "Paredes", emoji: "🧱", equipped: "base", 
        items: { 
            "base": { 
                name: "Paredes Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/paredes.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/paredes_estandar.avif"
            } 
        } 
    },
    techo: { 
        label: "Techo", emoji: "🛖", equipped: "base", 
        items: { 
            "base": { 
                name: "Techo Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/techo.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/techo_estandar.avif"
            } 
        } 
    },
    puerta: { 
        label: "Puerta", emoji: "🚪", equipped: "base", 
        items: { 
            "base": { 
                name: "Puerta Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/puerta.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/puerta_estandar.avif"
            } 
        } 
    },
    interruptor: { 
        label: "Interruptor", emoji: "🎛️", equipped: "base", 
        items: { 
            "base": { 
                name: "Interruptor Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/interruptor.glb", 
                price: 0, owned: true
            } 
        } 
    },
    foco: { 
        label: "Foco", emoji: "💡", equipped: "base", 
        items: { 
            "base": { 
                name: "Foco Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/foco.glb", 
                baseFile: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/base_foco.glb", 
                price: 0, owned: true 
            },
            "foco_brillante": { 
                name: "Foco Brillante", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/foco.glb", 
                baseFile: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/base_foco.glb", 
                price: 250, owned: false 
            }
        } 
    },
    cama: { 
        label: "Cama", emoji: "🛏️", equipped: "base", 
        items: { 
            "base": { 
                name: "Cama Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/cama.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/cama_estandar.avif"
            },
            "cama_brillante": { 
                name: "Cama Brillante", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/cama_brillante.glb", 
                price: 500, owned: false,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/cama_brillante.png"
            }
        } 
    },
    silla: { 
        label: "Silla", emoji: "🪑", equipped: "base", 
        items: { 
            "base": { 
                name: "Silla Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/silla.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/silla_estandar.avif"
            } 
        } 
    },
    pc: { 
        label: "Setup PC", emoji: "🖥️", equipped: "base", 
        items: { 
            "base": { 
                name: "PC Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/pc.glb", 
                baseFile: "pantalla_pc.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/pc_estandar.avif"
            } 
        } 
    },
    tele: { 
        label: "Televisor", emoji: "📺", equipped: "base", 
        items: { 
            "base": { 
                name: "Televisor Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/tele.glb", 
                baseFile: "pantalla.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/tele_estandar.avif"
            }
        } 
    },
    mueble1: { 
        label: "Mueble", emoji: "🗄️", equipped: "base", 
        items: { 
            "base": { 
                name: "Mueble 1 Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/mueble1.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/mueble_estandar.avif"
            } 
        } 
    },
    mueble2: { 
        label: "Escritorio", emoji: "🗄️", equipped: "base", 
        items: { 
            "base": { 
                name: "Mueble 2 Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/mueble2.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/escritorio_estandar.avif"
            } 
        } 
    },
    alfombra: { 
        label: "Alfombra", emoji: "🔲", equipped: "base", 
        items: { 
            "base": { 
                name: "Alfombra Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/alfombra.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/alfombra_estandar.avif"
            } 
        } 
    },
    cortinas: { 
        label: "Cortinas", emoji: "🪟", equipped: "base", 
        items: { 
            "base": { 
                name: "Cortinas Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/cortinas.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/cortinas_estandar.avif"
            } 
        } 
    },
    mousepad: { 
        label: "Mouse Pad", emoji: "🖱️", equipped: "base", 
        items: { 
            "base": { 
                name: "Mouse Pad Estándar", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/maouse_pad.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/maouse_pad_estandar.avif"
            } 
        } 
    },
    poster_1: { 
        label: "Póster 1", emoji: "🖼️", equipped: "base", 
        items: { 
            "base": { 
                name: "All Might", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/poster_1.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/poster_hero_academy1.avif"
            } 
        } 
    },
    poster_2: { 
        label: "Póster 2", emoji: "🖼️", equipped: "base", 
        items: { 
            "base": { 
                name: "Pikachu", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/poster_2.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/pikachu.avif"
            } 
        } 
    },
    poster_3: { 
        label: "Póster 3", emoji: "🖼️", equipped: "base", 
        items: { 
            "base": { 
                name: "Fondo", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/poster_3.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/flores_volando.avif"
            } 
        } 
    },
    poster_4: { 
        label: "Póster 4", emoji: "🖼️", equipped: "base", 
        items: { 
            "base": { 
                name: "Boku no Hero", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/poster_4.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/boku.avif"
            } 
        } 
    },
    deco_piso: { 
        label: "Adorno Piso", emoji: "🎍", equipped: "base", 
        items: { 
            "base": { 
                name: "Pepsi", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/decoracion_piso.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/pepsi.avif"
            } 
        } 
    },
    deco_escritorio: { 
        label: "Decoración 1", emoji: "🎍", equipped: "base", 
        items: { 
            "base": { 
                name: "CocaCola", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/decoracion_escritorio.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/cocacola.avif"
            } 
        } 
    },
    deco_mueble_2: { 
        label: "Decoración 2", emoji: "🎍", equipped: "base", 
        items: { 
            "base": { 
                name: "CocaCola", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/decoracion_mueble_2.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/cocacola.avif"
            } 
        } 
    },
    deco_2_mueble_2: { 
        label: "Decoración 3", emoji: "🎍", equipped: "base", 
        items: { 
            "base": { 
                name: "Libros", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/decoracion_2_mueble_2.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/libros2.avif"
            } 
        } 
    },
    deco_mueble_1: { 
        label: "Decoración 1", emoji: "🎍", equipped: "base", 
        items: { 
            "base": { 
                name: "CocaCola", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/decoracion_mueble_1.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/cocacola.avif"
            } 
        } 
    },
    deco_2_mueble_1: { 
        label: "Decoración 2", emoji: "🎍", equipped: "base", 
        items: { 
            "base": { 
                name: "Reproductor DVD", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/decoracion_2_mueble_1.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/dvd.avif"
            } 
        } 
    },
    deco_3_mueble_1: { 
        label: "Decoración 3", emoji: "🎍", equipped: "base", 
        items: { 
            "base": { 
                name: "Reproductor DVD", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/decoracion_3_mueble_1.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/dvd2.avif"
            } 
        } 
    },
    deco_4_mueble_1: { 
        label: "Decoración 4", emoji: "🎍", equipped: "base", 
        items: { 
            "base": { 
                name: "Libros", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/decoracion_4_mueble_1.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/libros.avif"
            } 
        } 
    },
    deco_5_mueble_1: { 
        label: "Decoración 5", emoji: "🎍", equipped: "base", 
        items: { 
            "base": { 
                name: "Libros", 
                file: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/decoracion_5_mueble_1.glb", 
                price: 0, owned: true,
                preview: "https://cdn.jsdelivr.net/gh/Archinime/-Archinime-@main/libros.avif"
            } 
        } 
    },
    videos: {
        label: "Videos TV", emoji: "📼", equipped: ["gohan_cell", "zoro_king", "rezero"], type: "multiple",
        items: {
            "gohan_cell": { name: "Gohan vs Cell", file: "gohan_vs_cell.mp4", price: 0, owned: true },
            "zoro_king": { name: "Zoro vs King", file: "zoro_vs_king.mp4", price: 0, owned: true },
            "rezero": { name: "Re:Zero", file: "rezero.mp4", price: 0, owned: true }
        }
    }
};

export const inventoryGroups = [
    { id: 'estructura', label: 'Estructura', emoji: '🏠', categories: ['piso', 'paredes', 'techo', 'puerta'] },
    { id: 'iluminacion', label: 'Iluminación', emoji: '💡', categories: ['interruptor', 'foco'] },
    { id: 'muebles', label: 'Muebles', emoji: '🛋️', categories: ['cama', 'silla', 'pc', 'tele', 'mueble1', 'mueble2'] },
    { id: 'textiles', label: 'Textiles', emoji: '🧶', categories: ['alfombra', 'cortinas', 'mousepad'] },
    { id: 'posters', label: 'Pósters', emoji: '🖼️', categories: ['poster_1', 'poster_2', 'poster_3', 'poster_4'] },
    { id: 'deco_mueble', label: 'Decoración del Mueble', emoji: '🎍', categories: ['deco_mueble_1', 'deco_2_mueble_1', 'deco_3_mueble_1', 'deco_4_mueble_1', 'deco_5_mueble_1'] },
    { id: 'deco_escritorio', label: 'Decoración del Escritorio', emoji: '🎍', categories: ['deco_escritorio', 'deco_mueble_2', 'deco_2_mueble_2'] },
    { id: 'deco_piso', label: 'Decoración del Piso', emoji: '🎍', categories: ['deco_piso'] },
    { id: 'multimedia', label: 'Multimedia', emoji: '🎵', categories: ['videos'] }
];