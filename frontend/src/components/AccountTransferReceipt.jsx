import React from "react";
import Logo from "./Logo.jsx";

export default function AccountTransferReceipt({ data, onClose, onNewTransfer }) {
  if (!data) return null;

  // Format dynamic receipt data with defaults matching user screenshot
  const montant = data.amount ? `${Number(data.amount).toLocaleString("fr-FR")} CFA` : "3 000 CFA";
  const frais = data.fee !== undefined ? `${Number(data.fee).toLocaleString("fr-FR")} CFA` : "100 CFA";
  const typeTransaction = data.typeLabel || "Compte à Compte";

  const prenomExpediteur = data.senderFirstName || data.senderName?.split(" ")[0] || "Rikardo";
  const nomExpediteur = data.senderLastName || data.senderName?.split(" ").slice(1).join(" ") || "Abdoulaye";
  const telExpediteur = data.senderPhone || "0022787903577";

  const codeEnvoi = data.code || data.reference || `MYNITA${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

  const prenomDestinataire = data.receiverFirstName || data.receiverName?.split(" ")[0] || "Abo";
  const nomDestinataire = data.receiverLastName || data.receiverName?.split(" ").slice(1).join(" ") || "Monique";
  const telDestinataire = data.receiverPhone || "0022791781184";

  const dateTransaction = data.date || new Date().toISOString().replace("T", " ").substring(0, 16);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Reçu de transfert My Nita",
          text: `Transfert de ${montant} effectué avec succès vers ${prenomDestinataire} ${nomDestinataire}. Code: ${codeEnvoi}`,
        });
      } catch (err) {
        console.log("Partage annulé");
      }
    } else {
      alert(`Reçu de transfert My Nita\nCode: ${codeEnvoi}\nMontant: ${montant}\nDestinataire: ${prenomDestinataire} ${nomDestinataire}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-md my-auto animate-in fade-in zoom-in duration-200">
        
        {/* ── Bannière verte de succès ── */}
        <div className="bg-[#16A34A] text-white p-4 rounded-t-2xl shadow-md">
          <h2 className="font-bold text-lg leading-tight">Succès</h2>
          <p className="text-sm font-medium text-white/95 mt-0.5">Transferts effectué avec succès</p>
        </div>

        {/* ── Carte principale du Reçu ── */}
        <div className="relative bg-white p-5 rounded-b-2xl shadow-xl border-t border-gray-100">
          
          {/* Encoches latérales de ticket de caisse */}
          <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-black/60" />
          <div className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-black/60" />

          {/* En-tête avec boutons Partager & Imprimer */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-[#E8EEFF] text-[#0F2C6B] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              title="Partager le reçu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-5.368m0 5.368l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            <button
              onClick={handlePrint}
              className="w-10 h-10 rounded-full bg-[#FFEFE5] text-[#E87040] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              title="Imprimer / Télécharger"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>

          {/* Logo central NITA */}
          <div className="flex justify-center my-1">
            <Logo size="md" />
          </div>

          {/* Lignes du Reçu */}
          <div className="divide-y divide-gray-100 text-xs sm:text-sm mt-3">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Montant de la transaction</span>
              <span className="font-bold text-[#0F2C6B]">{montant}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Frais d&apos;envoi</span>
              <span className="font-bold text-[#0F2C6B]">{frais}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Type de transaction</span>
              <span className="font-bold text-[#0F2C6B]">{typeTransaction}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Prénom expediteur</span>
              <span className="font-bold text-[#0F2C6B]">{prenomExpediteur}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Nom expediteur</span>
              <span className="font-bold text-[#0F2C6B]">{nomExpediteur}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Téléphone expediteur</span>
              <span className="font-bold text-[#0F2C6B]">{telExpediteur}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Code d&apos;envoi</span>
              <span className="font-bold text-[#0F2C6B] tracking-wide font-mono">{codeEnvoi}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Prénom destinataire</span>
              <span className="font-bold text-[#0F2C6B]">{prenomDestinataire}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Nom destinataire</span>
              <span className="font-bold text-[#0F2C6B]">{nomDestinataire}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Téléphone destinataire</span>
              <span className="font-bold text-[#0F2C6B]">{telDestinataire}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Date transaction</span>
              <span className="font-bold text-[#0F2C6B]">{dateTransaction}</span>
            </div>
          </div>

          {/* Boutons d'action inférieurs */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-[#F2541B] hover:bg-[#D94510] text-white font-bold py-3.5 px-4 rounded-2xl text-center text-sm shadow-md transition-colors cursor-pointer"
            >
              Terminer
            </button>

            <button
              onClick={onNewTransfer || onClose}
              className="flex-1 bg-[#005294] hover:bg-[#003B6D] text-white font-bold py-3.5 px-4 rounded-2xl text-center text-sm shadow-md transition-colors cursor-pointer"
            >
              Autre envoi
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
