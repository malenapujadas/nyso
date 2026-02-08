import { supabase } from "./supabase.js";

// enviar solicitud de conexión
export async function sendConnectionRequest(requesterId, receiverId) {
  const { data, error } = await supabase
    .from("connections")
    .insert([
      {
        requester_id: requesterId,
        receiver_id: receiverId,
        status: "pending",
      },
    ])
    .select("*")
    .single();

  if (error) {
    console.error("[connections.js] Error al enviar solicitud:", error);
    throw error;
  }

  console.log("[connections.js] Solicitud creada correctamente:", data);
  return data;
}

// obtener solicitudes recibidas
export async function getReceivedConnections(userId) {
  const { data, error } = await supabase
    .from("connections")
    .select("*, requester_id, receiver_id")
    .eq("receiver_id", userId)
    .eq("status", "pending");

  if (error) throw error;
  return data || [];
}

// aceptar o rechazar solicitud
export async function updateConnectionStatus(connectionId, status) {
  const { data, error } = await supabase
    .from("connections")
    .update({ status })
    .eq("id", connectionId);

  if (error) throw error;
  return data;
}

// obtener amigos aceptados
export async function getFriends(userId) {
  const { data, error } = await supabase
    .from("connections")
    .select(
      `
      id,
      status,
      requester_id,
      receiver_id,
      requester:requester_id(id, display_name, email),
      receiver:receiver_id(id, display_name, email)
    `
    )
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq("status", "accepted");

  if (error) {
    console.error("[connections.js] Error al obtener amigos:", error);
    return [];
  }

  return data.map((conn) =>
    conn.requester_id === userId ? conn.receiver : conn.requester
  );
}

/* export async function getPendingRequests(userId) {
  // traer las solicitudes pendientes incluyendo datos del requester
  const { data, error } = await supabase
    .from("connections")
    .select(`*, requester:requester_id(id, display_name, email)`)
    .eq("receiver_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error("[connections.js] Error al traer pendientes:", error);
    return [];
  }

  /* return data; */ 
  /* return data.map((req) => req.receiver_id); 
} */

// 1. Para Red Social (Saber a quién le envié yo)
export async function getPendingRequestsSent(userId) {
  const { data, error } = await supabase
    .from("connections")
    .select("receiver_id") // Solo necesito el ID del destinatario
    .eq("requester_id", userId) // YO soy el que pide
    .eq("status", "pending");

  if (error) {
    console.error("[connections.js] Error al traer enviadas:", error);
    return [];
  }

  // Devolvemos array de IDs: [1, 5, 9]
  return data.map((req) => req.receiver_id);
}

// 2. Para Mi Perfil (Saber quién me envió a mí)
export async function getPendingRequestsReceived(userId) {
  const { data, error } = await supabase
    .from("connections")
    .select(`
      id, 
      status, 
      requester_id, 
      requester:requester_id(id, display_name, email)
    `) // Traigo datos del que me pide
    .eq("receiver_id", userId) // YO soy el que recibe
    .eq("status", "pending");

  if (error) {
    console.error("[connections.js] Error al traer recibidas:", error);
    return [];
  }

  return data; // Devolvemos objetos completos
}
