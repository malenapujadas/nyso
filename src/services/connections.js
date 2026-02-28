import { supabase } from "./supabase.js";

// enviar solicitud de conexión
export async function sendConnectionRequest(requesterId, receiverId) {
  try {
    // 1. Buscamos si existe la conexión en la dirección A -> B
    let { data: existingConn } = await supabase
      .from("connections")
      .select("*")
      .match({ requester_id: requesterId, receiver_id: receiverId })
      .maybeSingle();

    // 2. Si no existe, buscamos en la dirección inversa B -> A (por si te había mandado él antes)
    if (!existingConn) {
      const { data: reverseConn } = await supabase
        .from("connections")
        .select("*")
        .match({ requester_id: receiverId, receiver_id: requesterId })
        .maybeSingle();
      
      existingConn = reverseConn;
    }

    if (existingConn) {
      // 3. Si YA EXISTE (en cualquier dirección), la "revivimos"
      const { data, error } = await supabase
        .from("connections")
        .update({ 
          status: "pending",
          requester_id: requesterId, // El que pide ahora sos vos
          receiver_id: receiverId 
        })
        .eq("id", existingConn.id)
        .select("*")
        .single();

      if (error) throw error;
      console.log("[connections.js] Solicitud reciclada correctamente:", data);
      return data;

    } else {
      // 4. Si NO EXISTÍA de ninguna forma, la creamos desde cero
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
      console.log("[connections.js] Solicitud creada correctamente:", data);
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
