<script>
import { toast } from 'vue3-toastify';
import AppH1 from "../components/AppH1.vue";
import { subscribeToAuthChanges, getCurrentUser } from "../services/auth.js";
import { getFavorites, removeFavorite } from "../services/favorites.js";
import { getHistory, clearHistory } from "../services/history.js";
import { getPreferencesForUser } from "../services/preferences.js";
import * as opciones from "../data/preferences-options.js";
import {
  getFriends,
  getPendingRequestsReceived,
  updateConnectionStatus,
} from "../services/connections.js";
import { getVinos } from "../services/wines.js";
import ProfilePreferences from "../components/ProfilePreferences.vue";

export default {
  name: "MyProfile",
  components: { AppH1, ProfilePreferences },
  data() {
    return {
      user: {
        id: null,
        email: null,
        display_name: null,
        avatar_url: null,
      },
      favorites: [],
      history: [],
      preferences: null,
      ...opciones,
      friends: [],
      pendingRequests: [],
    };
  },
  mounted() {
    subscribeToAuthChanges(async (userState) => {
      // Si hay un usuario logueado
      if (userState && userState.id) {
        const fullUser = await getCurrentUser();
        this.user = fullUser || userState;

        const vinosDB = await getVinos();

        const [favIds, hisIds, friends, pending] = await Promise.all([
          getFavorites(this.user.id),
          getHistory(this.user.id),
          getFriends(this.user.id),
          getPendingRequestsReceived(this.user.id),
        ]);

        this.friends = friends;
        this.pendingRequests = pending;

        this.favorites = vinosDB.filter(
          (v) => favIds.includes(Number(v.id)) || favIds.includes(String(v.id)),
        );

        this.history = vinosDB
          .map((v) => {
            const match = hisIds.find((h) => String(h.vino_id) === String(v.id));
            if (match) {
              return { ...v, note: match.note };
            }
            return null;
          })
          .filter(Boolean);

        this.preferences = await getPreferencesForUser(this.user.id);
      } else {
        // Si no hay usuario (cerró sesión)
        this.user = {
          id: null,
          email: null,
          display_name: null,
          avatar_url: null,
        };
      }
    });
  },

  methods: {
    // ✅ NUEVO: scroll a sección
    scrollToSection(id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    },

    async handleRemoveFavorite(id) {
      try {
        await removeFavorite(this.user.id, id);
        this.favorites = this.favorites.filter((f) => f.id !== id);
      } catch (error) {
        console.error(
          "[MyProfile.vue handleRemoveFavorite] Error al eliminar vino de favoritos: ",
          error,
        );
        throw new Error(error.message);
      }
    },
    async handleRemoveHistory(id) {
      try {
        await clearHistory(this.user.id, id);
        this.history = this.history.filter((h) => h.id !== id);
      } catch (error) {
        console.error(
          "[MyProfile.vue handleRemoveHistory] Error al eliminar vino del historial: ",
          error,
        );
        throw new Error(error.message);
      }
    },

    async handleResponse(reqOrId, status) {
      try {
        const connectionId =
          typeof reqOrId === "string" || typeof reqOrId === "number"
            ? reqOrId
            : reqOrId?.connection_id ||
              reqOrId?.connectionId ||
              reqOrId?.id ||
              reqOrId?.request_id;

        if (!connectionId) {
          console.error(
            "[MyProfile.vue handleResponse] connectionId undefined:",
            reqOrId,
          );
          return;
        }

        await updateConnectionStatus(connectionId, status);

        // recargar pendientes y amigos
        if (this.user && this.user.id) {
          const friends = await getFriends(this.user.id);
          const pending = await getPendingRequestsReceived(this.user.id);
          this.friends = friends;
          this.pendingRequests = pending;
        }
      } catch (error) {
        console.error(
          "[MyProfile.vue handleResponse] Error actualizando solicitud: ",
          error,
        );
      }
    },

    async handleRemoveFriend(friend) {
      try {
        const connectionId = friend?.connection_id || friend?.connectionId || friend?.id;

        if (!connectionId) {
          console.error(
            "[MyProfile.vue handleRemoveFriend] connectionId undefined:",
            friend,
          );
          return;
        }

        await updateConnectionStatus(connectionId, "removed");

        if (this.user && this.user.id) {
          this.friends = await getFriends(this.user.id);
        }

        //notificacion de eliminaste a amigo
        const nombreEliminado = friend.display_name || friend.email || 'este usuario';
        toast(`Eliminaste a ${nombreEliminado} de tu lista de amigos.`);
      } catch (error) {
        console.error(
          "[MyProfile.vue handleRemoveFriend] Error eliminando amigo: ",
          error,
        );
      }
    },

    normalizarValor(val) {
      if (val === null || val === undefined) return "";
      if (Array.isArray(val))
        return val.map((x) => String(x).toLowerCase().trim()).join(" ");
      return String(val).toLowerCase().trim();
    },

    armarSugeridos() {
      if (!this.preferences || !this.vinosDB || !this.vinosDB.length) {
        this.sugeridos = [];
        return;
      }

      const favIds = new Set(this.favorites.map((v) => String(v.id)));
      const hisIds = new Set(this.history.map((v) => String(v.id)));

      const prefs = this.preferences;

      const puntuar = (vino) => {
        let score = 0;

        // compara por campos comunes si existen
        const checks = [
          ["tipo", "tipo"],
          ["uva", "uva"],
          ["region", "region"],
          ["bodega", "bodega"],
        ];

        checks.forEach(([prefKey, vinoKey]) => {
          const pv = this.normalizarValor(prefs?.[prefKey]);
          const vv = this.normalizarValor(vino?.[vinoKey]);
          if (pv && vv && (vv.includes(pv) || pv.includes(vv))) score += 3;
        });

        // fallback: si tus preferencias tienen otras keys (ej: dulzor, cuerpo, etc)
        // suma 1 punto por coincidencias de texto
        Object.keys(prefs || {}).forEach((k) => {
          const pv = this.normalizarValor(prefs[k]);
          if (!pv) return;
          const vv = this.normalizarValor(vino?.[k]);
          if (vv && (vv.includes(pv) || pv.includes(vv))) score += 1;
        });

        return score;
      };

      const candidatos = this.vinosDB
        .filter((v) => !favIds.has(String(v.id)) && !hisIds.has(String(v.id)))
        .map((v) => ({ ...v, __score: puntuar(v) }))
        .sort((a, b) => b.__score - a.__score);

      this.sugeridos = candidatos.filter((v) => v.__score > 0).slice(0, 10);

      // si no matchea nada, mostramos algo “random” como fallback
      if (!this.sugeridos.length) {
        this.sugeridos = this.vinosDB
          .filter((v) => !favIds.has(String(v.id)) && !hisIds.has(String(v.id)))
          .slice(0, 10);
      }
    },

    scrollSugeridos(dir) {
      const el = this.$refs?.sugeridosTrack;
      if (!el) return;
      const amount = Math.round(el.clientWidth * 0.85);
      el.scrollBy({ left: dir * amount, behavior: "smooth" });
    },
  },
};
</script>

<template>
  <section class="min-h-screen bg-[#f6f6eb] relative overflow-hidden">
    <!-- Iconos mobile -->
    <div class="relative w-full h-0 lg:hidden">
      <img
        src="/icono1.png"
        alt="icono"
        class="absolute top-[-40px] left-8 w-12 opacity-100 rotate-12"
      />
      <img
        src="/icono3.png"
        alt="icono"
        class="absolute top-[-10px] right-3 w-10 opacity-100 rotate-3"
      />
      <img
        src="/icono7.png"
        alt="icono"
        class="absolute top-[30px] left-16 w-6 opacity-100 -rotate-12"
      />
    </div>

    <!-- iconos escritorio -->
    <img
      src="/icono1.png"
      alt="icono"
      class="hidden lg:block absolute top-30 left-98 w-14 opacity-100 rotate-12"
    />
    <img
      src="/icono6.png"
      alt="icono"
      class="hidden lg:block absolute bottom-20 right-12 w-22 opacity-100 -rotate-6"
    />
    <img
      src="/icono1.png"
      alt="icono"
      class="hidden lg:block absolute top-1/5 right-20 w-14 opacity-100 rotate-12"
    />
    <img
      src="/icono3.png"
      alt="icono"
      class="hidden lg:block absolute top-1/3 right-[8%] w-20 opacity-100 rotate-3"
    />
    <img
      src="/icono7.png"
      alt="icono"
      class="hidden lg:block absolute bottom-[18%] left-[4%] w-25 opacity-100 -rotate-12"
    />
    <img
      src="/icono6.png"
      alt="icono"
      class="hidden lg:block absolute bottom-40 right-12 w-22 opacity-100 -rotate-6"
    />
    <img
      src="/icono1.png"
      alt="icono"
      class="hidden lg:block absolute bottom-[60%] left-20 w-14 opacity-100 rotate-12"
    />
    <img
      src="/icono7.png"
      alt="icono"
      class="hidden lg:block absolute bottom-[40%] left-[4%] w-14 opacity-100 -rotate-12"
    />

    <!-- CONTENEDOR PRINCIPAL  -->
    <div class="mx-auto max-w-6xl px-6 md:px-12 py-12 relative z-10">
      <div
        class="rounded-3xl border border-[#4e0d05]/10 bg-[#ede8d7]/70 backdrop-blur-sm p-6 md:p-8 shadow-sm"
      >
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div class="flex items-center gap-4">
            <img
              v-if="user.avatar_url"
              :src="user.avatar_url"
              class="w-14 h-14 rounded-2xl object-cover border border-[#e099a8]/40 shadow-sm"
            />

            <div
              v-else
              class="w-14 h-14 rounded-2xl bg-[#e099a8]/25 border border-[#e099a8]/40 flex items-center justify-center text-[#4e0d05] font-extrabold text-xl"
            >
              {{
                (user.display_name || user.email || "U")
                  .slice(0, 1)
                  .toUpperCase()
              }}
            </div>

            <div class="text-left">
              <h1
                class="text-2xl md:text-3xl font-extrabold text-[#4e0d05] leading-tight"
              >
                {{
                  user.display_name ||
                  (user.email ? user.email.split("@")[0] : "Usuario")
                }}
              </h1>
              <p class="text-sm text-[#4e0d05]/60 mt-1">
                {{ user.email }}
              </p>
            </div>
          </div>

          <!-- ✅ SOLO CAMBIO: ahora son clickeables y scrollean -->
          <div class="grid grid-cols-3 gap-3 md:gap-4">
            <button
              type="button"
              @click="scrollToSection('wishlist')"
              class="rounded-2xl bg-white/40 border border-[#4e0d05]/10 px-4 py-3 text-center hover:bg-white/60 transition"
            >
              <p class="text-xs text-[#4e0d05]/60">Wishlist</p>
              <p class="text-lg font-bold text-[#4e0d05]">
                {{ favorites.length }}
              </p>
            </button>

            <button
              type="button"
              @click="scrollToSection('historial')"
              class="rounded-2xl bg-white/40 border border-[#4e0d05]/10 px-4 py-3 text-center hover:bg-white/60 transition"
            >
              <p class="text-xs text-[#4e0d05]/60">Historial</p>
              <p class="text-lg font-bold text-[#4e0d05]">
                {{ history.length }}
              </p>
            </button>

            <button
              type="button"
              @click="scrollToSection('amigos')"
              class="rounded-2xl bg-white/40 border border-[#4e0d05]/10 px-4 py-3 text-center hover:bg-white/60 transition"
            >
              <p class="text-xs text-[#4e0d05]/60">Amigos</p>
              <p class="text-lg font-bold text-[#4e0d05]">
                {{ friends.length }}
              </p>
            </button>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-3">
          <RouterLink
            to="/mi-perfil/editar"
            class="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#4e0d05] text-[#f6f6eb] text-sm font-semibold hover:bg-[#3c490b] transition"
          >
            Editar perfil
          </RouterLink>
        </div>

        <!-- preferencias -->
        <div v-if="preferences" class="mt-8">
          <h3 class="font-semibold text-xl text-[#3c490b] mb-3">
            Tus preferencias
          </h3>
          <ProfilePreferences :preferences="preferences" />
        </div>
      </div>

      <!--  Box mensual -->
      <div
        class="mt-10 rounded-3xl border border-[#3c490b]/20 bg-[#ede8d7]/80 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div class="text-left">
          <p class="text-sm text-[#4e0d05]/70 font-medium">Box mensual</p>
          <p
            class="text-lg md:text-xl font-extrabold text-[#4e0d05] leading-tight"
          >
            Un vino por mes, elegido por NYSO.
          </p>
        </div>

        <RouterLink
          to="/box"
          class="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#3c490b] text-[#4e0d05] font-semibold text-sm md:text-base bg-transparent hover:bg-[#3c490b] hover:text-[#f6f6eb] transition"
        >
          Comprar box mensual
        </RouterLink>
      </div>

      <!-- WISHLIST + HISTORIAL -->
      <div class="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- WISHLIST -->
        <div
          id="wishlist"
          class="scroll-mt-24 rounded-3xl border border-[#3c490b]/25 bg-[#3c490b]/5 p-6 shadow-sm"
        >
          <div class="mb-4">
            <h2 class="text-xl font-extrabold text-[#3c490b]">Wishlist</h2>
            <p class="text-sm text-[#4e0d05]/60">Vinos que querés probar</p>
          </div>

          <div v-if="favorites.length" class="divide-y divide-[#4e0d05]/10">
            <div
              v-for="v in favorites"
              :key="v.id"
              class="py-4 flex items-center justify-between gap-4"
            >
              <div class="text-left">
                <p class="font-semibold text-[#4e0d05] leading-tight">
                  {{ v.nombre }}
                </p>
                <p class="text-xs text-[#4e0d05]/60">
                  {{ v.bodega }} — {{ v.tipo }}
                </p>
              </div>

              <div class="flex gap-2 shrink-0">
                <RouterLink
                  :to="{ name: 'detalle', params: { id: v.id } }"
                  class="px-3 py-1 rounded-full border border-[#3c490b] text-[#3c490b] text-xs font-semibold hover:bg-[#3c490b] hover:text-white transition"
                >
                  Ver
                </RouterLink>

                <button
                  @click="handleRemoveFavorite(v.id)"
                  class="px-3 py-1 rounded-full bg-[#e099a8] text-[#3c490b] text-xs font-semibold hover:bg-[#3c490b] hover:text-white transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <p v-else class="text-[#4e0d05]/60 italic">
            Aún no tenés vinos en tu wishlist.
          </p>
        </div>

        <!-- HISTORIAL -->
        <div
          id="historial"
          class="scroll-mt-24 rounded-3xl border border-[#3c490b]/25 bg-[#3c490b]/5 p-6 shadow-sm"
        >
          <div class="mb-4">
            <h2 class="text-xl font-extrabold text-[#3c490b]">Historial</h2>
            <p class="text-sm text-[#4e0d05]/60">Lo que ya probaste</p>
          </div>

          <div v-if="history.length" class="divide-y divide-[#4e0d05]/10">
            <div
              v-for="v in history"
              :key="v.id"
              class="py-4 flex flex-col gap-2"
            >
              <div class="flex items-center justify-between gap-4">
                <div class="text-left">
                  <p class="font-semibold text-[#4e0d05] leading-tight">
                    {{ v.nombre }}
                  </p>
                  <p class="text-xs text-[#4e0d05]/60">
                    {{ v.bodega }} — {{ v.tipo }}
                  </p>
                </div>

                <div class="flex gap-2 shrink-0">
                  <RouterLink
                    :to="{ name: 'detalle', params: { id: v.id } }"
                    class="px-3 py-1 rounded-full border border-[#3c490b] text-[#3c490b] text-xs font-semibold hover:bg-[#3c490b] hover:text-white transition"
                  >
                    Ver
                  </RouterLink>

                  <button
                    @click="handleRemoveHistory(v.id)"
                    class="px-3 py-1 rounded-full bg-[#e099a8] text-[#3c490b] text-xs font-semibold hover:bg-[#3c490b] hover:text-white transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <p v-if="v.note" class="text-sm text-[#4e0d05]/80 italic pl-1">
                “{{ v.note }}”
              </p>
            </div>
          </div>

          <p v-else class="text-[#4e0d05]/60 italic">
            No hay vinos en tu historial.
          </p>
        </div>
      </div>

      <!-- AMIGOS + PENDIENTES -->
      <div class="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          id="amigos"
          class="scroll-mt-24 rounded-3xl border border-[#4e0d05]/10 bg-[#ede8d7]/70 backdrop-blur-sm p-6 shadow-sm"
        >
          <h2 class="text-xl font-extrabold text-[#3c490b] mb-4">Mis amigos</h2>

          <div v-if="friends.length === 0" class="text-[#4e0d05]/60 italic">
            No tenés amigos aún.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="f in friends"
              :key="f.id"
              class="bg-[#f6f6eb] rounded-2xl p-4 border border-[#4e0d05]/15 shadow-sm flex items-center justify-between"
            >
              <span class="font-semibold text-[#4e0d05]">
                {{ f.display_name || f.email || f.id }}
              </span>

              <button
                @click="handleRemoveFriend(f)"
                class="px-3 py-1 rounded-full border border-[#4e0d05]/40 text-[#4e0d05] text-xs font-semibold hover:bg-[#4e0d05] hover:text-[#f6f6eb]"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Solicitudes -->
        <div
          id="solicitudes"
          class="rounded-3xl border border-[#4e0d05]/10 bg-[#ede8d7]/70 backdrop-blur-sm p-6 shadow-sm"
        >
          <h2 class="text-xl font-extrabold text-[#3c490b] mb-4">
            Solicitudes pendientes
          </h2>

          <div
            v-if="pendingRequests.length === 0"
            class="text-[#4e0d05]/60 italic"
          >
            No hay solicitudes pendientes.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="r in pendingRequests"
              :key="r.id"
              class="bg-[#f6f6eb] rounded-2xl p-4 border border-[#4e0d05]/15 shadow-sm flex items-center justify-between"
            >
              <span class="font-semibold text-[#4e0d05]">
                {{
                  r?.requester?.display_name ||
                  r?.requester?.email ||
                  r.requester_id
                }}
              </span>

              <div class="flex gap-2">
                <button
                  @click="handleResponse(r, 'accepted')"
                  class="px-3 py-1 bg-[#3c490b] text-white rounded-full text-xs font-semibold"
                >
                  Aceptar
                </button>

                <button
                  @click="handleResponse(r, 'rejected')"
                  class="px-3 py-1 bg-[#e099a8] text-[#3c490b] rounded-full text-xs font-semibold"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>