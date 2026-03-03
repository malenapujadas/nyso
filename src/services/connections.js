import { supabase } from "./supabase.js";

// enviar solicitud de conexión
export async function sendConnectionRequest(requesterId, receiverId) {
  try {
    //  Buscamos si existe la conexión en la dirección A 
    let { data: existingConn } = await supabase
      .from("connections")
      .select("*")
      .match({ requester_id: requesterId, receiver_id: receiverId })
      .maybeSingle();

    // Si no existe, buscamos en la dirección inversa 
    if (!existingConn) {
      const { data: reverseConn } = await supabase
        .from("connections")
        .select("*")
        .match({ requester_id: receiverId, receiver_id: requesterId })
        .maybeSingle();
      
      existingConn = reverseConn;
    }

    if (existingConn) {
      // 3. Si ya existe la revivimos
      const { data, error } = await supabase
        .from("connections")
        .update({ 
          status: "pending",
          requester_id: requesterId, 
          receiver_id: receiverId 
        })
        .eq("id", existingConn.id)
        .select("*")
        .single();

      if (error) throw error;
      /* console.log("[connections.js] Solicitud reciclada correctamente:", data); */
      return data;

    } else {
      // Si no EXISTÍA de ninguna forma, la creamos desde cero
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

      if (error) throw error;
      /* console.log("[connections.js] Solicitud creada correctamente:", data); */
      return data;
    }
  } catch (error) {
    console.error("[connections.js] Error al enviar solicitud:", error);
    throw error;
  }
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
      requester:requester_id(id, display_name, email, avatar_url), 
      receiver:receiver_id(id, display_name, email, avatar_url)
    ` 
    )
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq("status", "accepted");

  if (error) {
    console.error("[connections.js] Error al obtener amigos:", error);
    return [];
  }

  // devolvemos el perfil del amigo, pero le sumamos el connection_id
  return data.map((conn) => {
    const friendProfile = conn.requester_id === userId ? conn.receiver : conn.requester;
    return {
      ...friendProfile,
      connection_id: conn.id 
    };
  });
}


// Para Red Social 
export async function getPendingRequestsSent(userId) {
  const { data, error } = await supabase
    .from("connections")
    .select("receiver_id") 
    .eq("requester_id", userId) // YO soy el que pide
    .eq("status", "pending");

  if (error) {
    console.error("[connections.js] Error al traer enviadas:", error);
    return [];
  }

  // Devolvemos array de IDs: [1, 5, 9]
  return data.map((req) => req.receiver_id);
}

// Para Mi Perfil
export async function getPendingRequestsReceived(userId) {
  const { data, error } = await supabase
    .from("connections")
    .select(`
      id, 
      status, 
      requester_id, 
      requester:requester_id(id, display_name, email)
    `) // Traigo datos del que me pide
    .eq("receiver_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error("[connections.js] Error al traer recibidas:", error);
    return [];
  }

  return data; // Devolvemos objetos completos
}
