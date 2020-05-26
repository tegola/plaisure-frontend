export default {
	// Common -----------------------------------------------------------------
	common: {
		weekdays: {
			monday: 'Lunedì',
			tuesday: 'Martedì',
			wednesday: 'Mercoledì',
			thursday: 'Giovedì',
			friday: 'Venerdì',
			saturday: 'Sabato',
			sunday: 'Domenica'
		},
		status: {
			error: 'Errore',
			loading: 'Caricamento',
			offline: 'Attenzione: non sei connesso a internet!',
			load_error:
				'È avvenuto un errore nel tentativo di caricamento dei dati. Prova di nuovo.',
			invalid_form:
				'Ci sono degli errori nel modulo. Controlla i dati inseriti.',
			save_error:
				'È avvenuto un errore nel tentativo di salvare i dati. Prova di nuovo.'
		},
		actions: {
			add: 'Aggiungi',
			back: 'Indietro',
			cancel: 'Annulla',
			change: 'Cambia',
			close: 'Chiudi',
			continue: 'Continua',
			delete: 'Elimina',
			done: 'Fatto',
			edit: 'Modifica',
			remove: 'Rimuovi',
			save: 'Salva',
			select: 'Scegli',
			sort: 'Riordina',
			upload: 'Carica'
		},
		cookie: {
			agree: 'Utilizzando questo sito acconsenti alla nostra {policy_link}',
			link: "informativa sull'utilizzo dei cookie"
		}
	},

	// Components -------------------------------------------------------------
	components: {
		navbar: {
			home: 'Home',
			search: 'Cerca attività',
			login: 'Accedi',
			register: 'Iscriviti',
			promote: 'Promuovi la tua attività',
			company: 'Azienda e contatti',
			responsible: 'Gioco responsabile'
		},

		lightbox: {
			previous: 'Precedente',
			next: 'Seguente',
			close: 'Chiudi',
			counter: '{current} di {total}'
		},

		no_items: {
			title: 'Nessun elemento trovato'
		},

		footer: {
			search: 'Cerca attività',
			promote: 'Promuovi la tua attività',
			about: "L'azienda",
			responsible_gaming: 'Gioco responsabile',
			copyright: 'Copyright {year} {company}',
			vat: 'P. IVA {number}'
		},

		venue_item: {
			highlight: {
				new: 'Nuovo!',
				open: 'Aperto ora!'
			}
		},

		review_item: {
			owner_response: 'Risposta del gestore',
			actions: {
				reply: 'Rispondi',
				edit_reply: 'Modifica risposta',
				report: 'Segnala',
				reported: 'Segnalata'
			},
			reply_form: {
				label: 'Rispondi a questa recensione',
				post: 'Pubblica',
				update: 'Modifica risposta',
				delete: 'Cancella risposta'
			},
			report_dialog: {
				title: 'Segnala recensione',
				text:
					'Vuoi segnalare questa recensione come offensiva, inappropriata o spam?',
				submit: 'Invia segnalazione'
			}
		},

		review_form: {
			title: 'Lascia una recensione',
			rating: 'Valutazione',
			rating_error: 'Scegli la valutazione.',
			summary: 'Titolo',
			summary_placeholder:
				'Riassumi la tua visita o metti in evidenza un dettaglio interessante',
			summary_error: 'Riassumi in poche parole la tua recensione',
			body: 'Recensione',
			body_placeholder:
				"Raccontaci della tua esperienza in questo posto. Il servizio, l'atmosfera, l'ospitalità?",
			body_error: 'Scrivi la recensione.',
			submit: 'Invia recensione',
			submit_success: 'Grazie della recensione!'
		},

		subscription_card: {
			price: '{currency}{price}/mese',
			highlight: 'Il più acquistato',
			perks: {
				presence: 'Dai visibilità alla tua attività',
				details:
					'Carica le foto, mostra gli orari di apertura e i servizi disponibli',
				list: 'Mostra la tua attività nei risultati di ricerca',
				as_free: 'Le funzionalità del piano gratuito, più:',
				distance_bonus: 'Bonus del {amount}% nei risultati di ricerca',
				home_page_presence: 'Visibilità ricorrente in home page',
				hide_nearby_venues: 'Nasconde le attività nelle vicinanze'
			},
			error: {
				payment: 'Ancora inattivo: assicurati di aver confermato il pagamento.'
			},
			cancelled: {
				line1: 'Hai disattivato il {cancelDate}.',
				line2: 'Sarà funzionante fino al {endDate}.'
			}
		},

		rating: {
			tooltip: '{value} su {max}'
		}
	},

	// Pages ------------------------------------------------------------------
	pages: {
		home: {
			search: {
				title: 'Trova le sale da gioco più vicine a te.',
				subtitle:
					"Su {name} è veloce, e con più di migliaia di sale disponibili c'è solo l'imbarazzo della scelta!",
				label: 'Cerca',
				city_placeholder: 'Scrivi la tua città',
				location_placeholder: 'Vicino a te',
				location: 'Usa la tua posizione',
				location_error: 'Non è stato possibile trovare la tua posizione.',
				submit: 'Cerca'
			},
			venue: {
				hint: 'Mostra qui la tua attività'
			},
			explore: {
				title: 'Esplora'
			},
			highlights: {
				title: 'In rilievo'
			},
			new: {
				title: 'Novità'
			},
			promote: {
				intro: 'Scusa il gioco di parole',
				title: 'Mettiti in gioco',
				paragraph:
					'Registra la tua attività o rivendica un’attività già presente. È veloce, e soprattutto è gratis!',
				register: 'Registrati come proprietario',
				add: 'Aggiungi la tua attività',
				manage: 'Vai alla gestione attività',
				more: 'Maggiori informazioni'
			}
		},

		login: {
			meta_title: 'Accedi',
			title: 'Accedi',
			intro: 'Inserisci e-mail e password per accedere a {name}',
			email: 'Indirizzo e-mail',
			email_error: 'Inserisci il tuo indirizzo e-mail.',
			password: 'Password',
			password_error: 'Inserisci la password.',
			submit: 'Accedi',
			submit_error: 'E-mail e password errate.',
			forgot: 'Password dimenticata?',
			register1: 'Non sei ancora iscritto? {link}',
			register2: 'Fallo subito!'
		},

		register: {
			owner: {
				meta_title: 'Iscriviti come proprietario',
				title: 'Iscriviti a {name} come proprietario',
				intro: 'Potrai così reclamare la tua attività o aggiungerne una nuova.'
			},

			user: {
				meta_title: 'Iscriviti',
				title: 'Iscriviti a {name}',
				intro:
					'Potrai così salvare le tue attività preferite, votarle e recensirle.'
			},

			name: 'Nome',
			name_error: 'Inserisci il tuo nome.',
			email: 'Indirizzo e-mail',
			email_error: 'Inserisci il tuo indirizzo e-mail.',
			password: 'Password',
			password_error: 'Scegli una password (minimo 8 caratteri).',
			agree1:
				'Cliccando su Iscriviti accetti le nostre {terms_link}. Scopri in che modo usiamo i tuoi dati nella nostra {privacy_link}.',
			agree2: 'Condizioni',
			agree3: 'Normativa sui dati',
			submit: 'Iscriviti',
			submit_error: "Questo'indirizzo e-mail è già stato usato.",
			login1: 'Sei già registrato? {link}',
			login2: 'Accedi'
		},

		forgot_password: {
			title: 'Reimposta password',
			intro:
				'Inserisci il tuo indirizzo e-mail per ricevere un link per reimpostare la tua password.',
			email: 'Indirizzo e-mail',
			email_error: 'Inserisci il tuo indirizzo e-mail.',
			submit: 'Invia link',
			submit_success:
				'Fatto! Se questo indirizzo e-mail esiste nei nostri archivi riceverai un messaggio contenente un link per reimpostare la tua password.'
		},

		reset_password: {
			title: 'Reimposta password',
			intro: 'Scegli la tua nuova password.',
			email: 'Indirizzo e-mail',
			email_error: 'Inserisci il tuo indirizzo e-mail.',
			password: 'Password',
			password_error: 'Scegli una password (minimo 8 caratteri).',
			password_confirmation: 'Ripeti password',
			password_confirmation_error: 'Le password non coincidono.',
			submit: 'Reimposta password',
			submit_error:
				'Non è stato possibile reimpostare la tua password. Prova di nuovo.'
		},

		explore: {
			meta_title: 'Esplora',
			form: {
				location: {
					label: 'Posizione',
					geolocalization: 'Usa la tua posizione',
					geolocalization_error:
						'Non è stato possibile trovare la tua posizione.',
					placeholder: {
						default: 'Cerca vicino a...',
						geolocalization: 'Vicino a te',
						in_map: "All'interno della mappa"
					}
				},
				distance: 'Distanza',
				category: 'Tipo',
				amenities: 'Comodità',
				view: {
					list: 'Lista',
					map: 'Mappa'
				},
				results: 'Nessun risultato | 1 risultato | {count} risultati'
			},
			start: {
				title: 'Inserisci una posizione per iniziare'
			},
			list: {
				load_more: 'Load more results'
			},
			map: {
				search_area: 'Cerca in questa zona'
			},
			no_items: {
				title: 'Nessuna attività trovata',
				subtitle: 'Cerca in un altra zona o modifica i criteri ricerca.'
			}
		},

		venue_detail: {
			subtitle: '{category} a {city}',
			favorites: {
				add: 'Aggiungi ai preferiti',
				remove: 'Rimuovi dai preferiti'
			},
			gallery: {
				add: 'Aggiungi foto',
				all: 'Vedi tutte'
			},
			description: 'Descrizione attività',
			details: {
				title: 'Dettagli',
				concessionaire: 'Concessionario',
				surface_size: 'Dimensioni',
				surface_size_unit: 'mq.',
				vlt_machine_count: 'Numero di VLT',
				vlt_platforms: 'Piattaforme VLT',
				awp_machine_count: 'Numero di AWP',
				arcade_roulette: 'Roulette arcade',
				online_casino: 'Casinò online',
				sports_betting: 'Scommesse sportive',
				virtual_betting: 'Scommesse virtuali',
				horse_betting: 'Scommesse ippiche',
				parking_capacity: 'Posti auto',
				seating_capacity: 'Posti a sedere'
			},
			amenities: 'Comodità',
			card: {
				directions: 'Ottieni indicazioni stradali',
				closed: 'Chiuso',
				open_now: 'Aperto ora',
				closed_now: 'Chiuso ora',
				no_hours: 'Nessun orario',
				no_contact: 'Nessuna informazione di contatto',
				no_urls: 'Nessun sito o pagina social'
			},
			reviews: {
				title: 'Valutazioni e recensioni',
				count: '1 valutazione | {count} valutazioni',
				all: 'Vedi tutte',
				rate: 'Fai click per valutare',
				rate_success: 'Grazie della valutazione!',
				write: 'Lascia una recensione',
				login:
					'{action} per valutare o recensire questa attività.',
				login_action: 'Accedi'
			},
			claim: {
				title: 'È la tua attività?',
				intro:
					'Se sei il proprietaro di questa attività, puoi rivendicarla gratuitamente e tenerla aggiornata, aggiungere foto, jackpot e tanto altro.',
				more: 'Ulteriori informazioni',
				action: 'Rivendica attività'
				// subject: 'Rivendicazione attività: {name} (identificativo: {id})'
			},
			report: {
				title: 'Hai trovato un errore?',
				intro:
					"Se l'indirizzo o i dati sono errati, l'attività non esiste più, o se ci sono foto offensive, puoi segnalarla.",
				action: 'Segnala attività',
				subject: 'Segnalazione errore: {name} (identificativo: {id})'
			},
			nearby: 'Attività nei dintorni',
			common: {
				edit: 'modifica',
				unknown: 'sconosciuto',
				yes: 'Sì',
				no: 'No'
			}
		},

		venue_reviews: {
			meta_title: 'Tutte le recensioni per {name}',
			title: 'Tutte le recensioni',
			no_items: {
				title: 'Nessuna recensione',
				subtitle: 'Questa attività non ha ricevuto recensioni.'
			}
		},

		venue_claim: {
			meta_title: 'Rivendica attività: {name}',
			title: 'Rivendica attività',
			intro:
				'Stai per rivendicare la seguente attività, che non ha un proprietario. Così facendo essa sarà assegnata a te e potrai gestirne i dati.',
			continue: 'Per proseguire, fai click su “Continua”.',
			submit: 'Continua',
			back: "Torna all'attività",
			infobox: {
				title: 'È gratis!',
				body:
					"Gestire un'attività è completamente gratuito. Se lo vorrai, potrai sottoscrivere un'abbonamento mensile per promuoverla.",
				action: 'Maggiori informazioni'
			}
		},

		// /user ---------------------------------------------------------------
		user: {
			// /user/
			index: {
				title: 'Il mio account',
				logout: 'Esci',
				venues_label: 'Gestione attività',
				venues_count:
					'Nessuna attività registrata | 1 attività | {count} attività',
				info_label: 'Dati personali',
				info_sublabel: 'Nome, e-mail, lingua',
				billing: 'Fatturazione',
				favorites: 'Preferiti',
				password: 'Cambia password'
			},

			// /user/venues
			venues: {
				// /user/venues/
				index: {
					title: 'Gestione attività',
					subtitle_first: 'Inizia aggiungendo una nuova attività.',
					subtitle_edit: 'Fai click su una di esse per modificarla.',
					add_first: 'Aggiungi la tua prima attività',
					add_another: "Aggiungi un'altra attività"
				},

				// /user/venues/add
				add: {
					meta_title: 'Aggiungi attività',
					title: 'Aggiungi la tua attività',
					step_1: {
						title: 'Come si chiama la tua attività?',
						subtitle: "Scrivi il nome come mostrato sull'insegna.",
						name: 'Nome',
						name_error: 'Inserisci il nome della tua attività.'
					},
					step_2: {
						title: 'Dove si trova?',
						subtitle: "Inserisci l'indirizzo completo.",
						address: 'Indirizzo',
						address_line1_placeholder: 'Riga 1',
						address_line2_placeholder: 'Riga 2',
						address_error: "Inserisci tutti i dati dell'indirizzo.",
						city: 'Città',
						zipcode_province: 'CAP e provincia',
						zipcode_placeholder: 'CAP',
						province_placeholder: 'Provincia',
						country: 'Paese'
					},
					step_3: {
						title: 'Dove si trova esattamente?',
						subtitle:
							"Fatti trovare più facilmente! Sposta la mappa fino a far combaciare la puntina sull'edificio della tua attività.",
						location: 'Posizione'
					},
					step_4: {
						title: 'Che tipo di attività è?',
						subtitle: 'Seleziona una o più categorie.',
						categories: 'Categorie',
						categories_error: 'Scegli almeno una categoria.'
					}
				},

				// /user/venues/{id}
				detail: {
					title: 'Dettagli attività',
					menus: {
						overview: 'Panoramica',
						general: 'Nome e posizione',
						services: 'Servizi',
						photos: 'Foto',
						contacts: 'Contatti',
						hours: 'Orari',
						jackpots: 'Jackpot',
						// reviews: 'Recensioni',
						plan: 'Abbonamento'
					},
					overview: {
						title: 'Panoramica',
						stats: {
							ratings: '{count} valutazione | {count} valutazioni',
							reviews: 'Nessuna recensione | 1 recensione | {count} recensioni',
							favorites:
								'Preferito da {count} persona | Preferito da {count} persone'
						},
						visits: {
							title: 'Visite',
							count: '{count} visita | {count} visite',
							total: 'Nessuna visita | 1 visita totale | {count} visite totali'
						}
					},
					general: {
						title: 'Informazioni',
						name: 'Nome',
						name_placeholder: 'Es.: Casinò Las Vegas',
						name_error: 'Inserisci il nome della tua attività.',
						concessionaire: 'Concessionario',
						concessionaire_none: 'Nessuno',
						description: 'Descrizione',
						surface_size: 'Dimensioni',
						surface_size_unit: 'mq.',
						surface_size_error: 'Inserisci le dimensioni.',
						category: 'Categoria',
						category_error: 'Scegli almeno una categoria.',
						address: 'Indirizzo',
						address_line1_placeholder: 'Riga 1',
						address_line2_placeholder: 'Riga 2',
						address_error: "Inserisci tutti i dati dell'indirizzo.",
						city: 'Città',
						zipcode_province: 'CAP e provincia',
						zipcode_placeholder: 'CAP',
						province_placeholder: 'Provincia',
						country: 'Paese',
						location: 'Posizione esatta',
						location_searching: 'Cerco',
						location_hint: 'Trascina per riposizionare'
					},
					services: {
						title: 'Servizi',
						invalid_value: 'Valore non valido.',
						sports_betting: 'Scommesse sportive',
						virtual_betting: 'Scommesse virtuali',
						horse_betting: 'Scommesse ippiche',
						arcade_roulette: 'Roulette arcade',
						vlt_machine_count: 'N. macchine VLT',
						awp_machine_count: 'N. macchine AWP',
						seating_capacity: 'Posti a sedere',
						parking_capacity: 'Posti auto',
						vlt_platforms: 'Piattaforme VLT',
						amenities: 'Comodità'
					},
					photos: {
						title: 'Foto',
						reorder: 'Sposta le immagini per riordinarle.',
						delete: {
							title: 'Elimina foto',
							intro:
								"Vuoi {action}? Essa verrà rimossa dalla galleria ma sarà effettivamente eliminata solo dopo il salvataggio dei dati dell'attività.",
							intro_action: 'eliminare questa foto'
						},
						no_items: {
							title: 'Nessuna foto',
							subtitle: 'Aggiungi la prima foto tramite il pulsante Carica.'
						}
					},
					contacts: {
						title: 'Contatti',
						phone: 'Telefono',
						email: 'E-mail',
						email_placeholder: 'Es.: nome@gmail.com',
						email_error: 'Inserisci un indirizzo e-mail valido.',
						url_placeholder: 'https://',
						url_error:
							"Inserisci un URL valido, che inizi con 'http://' o 'https://'.",
						site: 'Sito web',
						online_casino: 'Casinò online',
						facebook: 'Pagina Facebook'
					},
					hours: {
						title: 'Orari',
						always: 'Sempre aperto (24h)',
						full: 'Orario continuato',
						split: 'Orario spezzato',
						closed: 'Chiuso',
						from_to: 'Dalle/alle',
						morning: 'Mattina (dalle/alle)',
						afternoon: 'Pomeriggio (dalle/alle)'
					},
					jackpots: {
						title: 'Jackpot',
						name: 'Jackpot {number}',
						name_placeholder: 'Nome',
						amount_placeholder: 'Valore'
					},
					reviews: {
						title: 'Recensioni'
					},
					plan: {
						title: 'Abbonamento',
						current: {
							title: 'Abbonamento corrente',
							price: '{price}/mese',
							payment_pending: {
								title: 'In attesa della conferma di pagamento',
								check:
									'Controlla la tua casella di posta elettronica per eventuali richieste di conferma e segui le istruzioni indicate.',
								cancel:
									"Se invece vuoi annullare l'abbonamento scelto e ricominciare da capo, fai click sul pulsante qui sotto.",
								action: 'Ricomincia'
							},
							ends: {
								title: 'Scade {date}',
								cancelled: 'Hai disattivato {date}.',
								action: 'Cambia abbonamento'
							},
							renews: {
								title: 'Si rinnova {date}',
								action: 'Cambia abbonamento'
							}
						},
						pick_new: "Scegli un piano d'abbonamento",
						selected_free:
							"Hai scelto l'abbonamento gratuito. Questo annullerà il rinnovo mensile e non ti verrà addebitato nessun altro costo. L'attuale abbonamento rimarrà comunque attivo fino allo scadere del periodo già pagato, ovvero fino al {date}.",
						selected_paid: 'Hai scelto un abbonamento a pagamento.',
						selected_paid_input_data:
							'Inserisci qui di seguito le tue informazioni di fatturazione e pagamento.',
						selected_paid_review_data:
							'Assicurati che le tue informazioni di fatturazione e pagamento siano corretti.',
						resume:
							'Hai disattivato questo abbonamento il {last_update_date}, ma non sarebbe scaduto fino al {end_date}. Riattivandolo non ti sarà addebitato nulla fino a tale data!',
						billing: {
							title: 'Fatturazione',
							current: "Usa l'indirizzo registrato",
							new: 'Inserisci un nuovo indirizzo',
							new_warning: {
								message:
									'{warning} se hai abbonamenti attivi sulle altre attività, esse verranno aggiornate le nuove informazioni di fatturazione.',
								warning: 'Attenzione:'
							},
							legal_name: "Denominazione legale dell'azienda",
							legal_name_error:
								"Inserisci la denominazione legale dell'azienda.",
							address: 'Indirizzo',
							address_error: "Inserisci l'indirizzo.",
							postcode: 'CAP',
							postcode_error: 'Inserisci il CAP.',
							city: 'Città',
							city_error: 'Inserisci la città.',
							region: 'Provincia',
							region_error: 'Inserisci la provincia.',
							country: 'Paese',
							country_error: 'Scegli il paese.',
							vat_number: 'Partita IVA',
							vat_number_error: 'Inserisci la partita IVA.'
						},
						payment: {
							title: 'Pagamento',
							current: 'Usa la carta di credito registrata',
							new: 'Usa una carta di credito diversa',
							new_warning: {
								message:
									'{warning} se hai abbonamenti attivi sulle altre attività, esse verranno aggiornate con le nuove informazioni di pagamento.',
								warning: 'Attenzione:'
							},
							card: 'Carda di credito',
							card_expiration: 'Scadenza',
							card_holder_name: 'Nome e cognome intestatario',
							card_holder_name_error:
								"Inserisci il nome e cognome dell'intestatario così come mostrati sulla carta stessa"
						},
						cancel: 'Cancella abbonamento',
						confirm: {
							title: 'Conferma abbonamento',
							paragraph1:
								"Stai per attivare un abbonamento costante. Se fai click su {confirm}, autorizzi {name} ad addebitarti mensilmente il costo dell'abbonamento (pari a {price}/mese). Puoi annullare l'abbonamento in qualsiasi momento.",
							paragraph2:
								"Se continui accetti i {tos} e l'{privacy} di {name}. Accetti inoltre che il tuo acquisto sarà subito disponibile e di rinunciare al diritto di recesso previsto dalla legge.",
							paragraph2_tos: 'Termini di servizio',
							paragraph2_privacy: 'Informativa sulla privacy',
							submit: 'Conferma abbonamento'
						},
						form_error:
							'Sembra che il modulo sia incompleto: inserisci tutti i dati richiesti prima di continuare.',
						submit_error:
							'È avvenuto un errore nel tentativo di modificare il tuo abbonamento. Il nostro staff di supporto è già stato informato. Ti preghiamo di riprovare più tardi.',
						subscription_confirm: {
							title: 'Conferma richiesta',
							message:
								'È necessaria la conferma del pagamento. Controlla la posta elettronica e segui le indicazioni fornite.'
						},
						subscription_success: {
							title: 'Abbonamento attivato',
							message:
								"L'abbonamento che hai scelto è stato attivato. Si rinnoverà automaticamente il {date}, salvo cancellazione da parte tua prima di tale data."
						},
						cancellation_success: {
							title: 'Abbonamendo cancellato',
							message:
								"Il rinnovo automatico del tuo abbonamento è stato disattivato. L'abbonamento rimarrà comunque attivo fino al {date}. Non ti sarà addebitato nessun altro costo."
						}
					}
				}
			},

			// /user/info
			info: {
				title: 'Dati personali',
				name: 'Nome',
				name_error: 'Inserisci il tuo nome.',
				name_hint:
					'Viene visualizzato nelle tue recensioni e nei messaggi e/o notifiche che potresti ricevere da {name}',
				email: 'Indirizzo e-mail',
				newsletter:
					'Voglio essere informato sulle nuove offerte e funzionalità',
				locale: 'Lingua e zona',
				locale_error: 'Scegli la tua lingua.',
				submit_success_title: 'Informazioni salvate',
				submit_success_text:
					'Le tue informazioni personali sono state aggiornate.'
			},

			billing: {
				title: 'Informazioni di fatturazione',
				intro: 'Saranno usate per generare tutte le tue fatture.',
				legal_name: "Denominazione legale dell'azienda",
				legal_name_error: "Inserisci la denominazione legale dell'azienda.",
				address: 'Indirizzo',
				address_error: "Inserisci l'indirizzo.",
				postcode: 'CAP',
				postcode_error: 'Inserisci il CAP.',
				city: 'Città',
				city_error: 'Inserisci la città.',
				region: 'Provincia',
				region_error: 'Inserisci la provincia.',
				country: 'Paese',
				country_error: 'Scegli il paese.',
				vat_number: 'Partita IVA',
				vat_number_error: 'Inserisci la partita IVA.',
				submit_success_title: 'Informazioni salvate',
				submit_success_text:
					'Le tue informazioni di fatturazione sono state aggiornate.'
			},

			// /user/favorites
			favorites: {
				title: 'Gestione preferiti',
				no_items: {
					title: 'Non hai preferiti',
					subtitle:
						"Puoi aggiungere un'attività ai preferiti in qualsiasi momento durante la navigazione."
				}
			},

			// /user/password
			password: {
				title: 'Cambia password',
				intro: 'Scegli una nuova password e ripetila per cambiarla.',
				password: 'Nuova password',
				password_hint: 'Almeno 8 caratteri tra lettere e numeri',
				password_error: 'Inserisci almeno 8 caratteri tra lettere e numeri.',
				password_confirmation: 'Ripeti password',
				password_confirmation_error: 'Le password non coincidono.',
				submit: 'Cambia password',
				submit_success_title: 'Password modificata',
				submit_success_text: 'La tua password è stata modificata correttamente.'
			}
		},

		promote: {
			meta_title: 'Promuovi la tua attività',
			hero: {
				title: 'Promuovi la tua attività, è gratis!',
				paragraph:
					"Sei il proprietario di un'attività inerente al mondo del gioco e vuoi promuoverla? La tua attività è già presente su {name} e vorresti ampliare le informazioni fornite ai visitatori? In entrambi i casi, {strong}",
				paragraph_strong: 'sei nel posto giusto!'
			},
			example: {
				paragraph1:
					"Aggiungendo o rivendicando un'attività ti permetterà di arrivare a futuri clienti inserendo le informazioni basilari come gli orari di apertura, foto, numero e tipologia di macchine, benefit, descrizione della tua sala ed altro ancora.",
				paragraph2:
					"Qui puoi vedere l'aspetto della pagina di una sala d'esempio con informazioni aggiuntive, come foto {1}, jackpot personalizzati {2}, dettagli e servizi {3} e contatti {4}.",
				paragraph3:
					'Più informazioni la tua pagina offre, più potenziali clienti potrebbero essere interessati a frequentare la tua sala. Ad esempio, specificare gli orari di apertura permette a chi fa una vita notturna di sapere se la sala è aperta anche in orari meno canonici.',
				paragraph4:
					'{name} viene consultato dai giocatori che stanno decidendo dove passare il proprio tempo libero, e potrebbero scegliere proprio la tua sala!'
			},
			cost: {
				title: 'Quanto costa?',
				paragraph1:
					'Assolutamente nulla! {name} offre diversi livelli di personalizzazione: {strong}; non spenderai niente, a parte pochi minuti del tuo tempo.',
				paragraph1_strong:
					"aggiungere un'attività o rivendicarla per inserire le informazioni essenziali è assolutamente gratuito",
				paragraph2:
					'Una volta presente nel catalogo di {name}, potrai evidenziare la tua attività e farla trovare più facilmente di quelle dei tuoi concorrenti semplicemente sottoscrivendo un abbonamento mensile che potrai disattivare quando vorrai. Non ci sono costi nascosti!'
			},
			start: {
				title: 'Che aspetti? Inizia subito!',
				paragraph1:
					'Se sei ancora indeciso, non dovresti esserlo. Aggiungere o rivendicare la tua attività porterà soltanto benefici. Potrai personalizzare la tua presenza su {name} e aggiornare i suoi dati in totale autonomia.',
				paragraph2:
					"Se hai già trovato la tua attività su {name}, fai click su “{strong}” nella pagina con i dettagli dell'attività per continuare. Se non l'hai già fatto, dovrai registrarti.",
				paragraph2_strong: 'Rivendica attività'
			},
			manage: 'Gestisci la tua attività',
			register: 'Registrati come proprietario'
		},

		about: {
			meta_title: 'Informazioni e contatti',
			company: {
				title: "Che cos'è {name}",
				paragraph1:
					"{name} è una startup che combina le capacità tecnologiche di web e di design da un lato, e l'esperienza nel settore gioco a livello mondiale dall'altro.",
				paragraph2:
					'Nel panorama mondiale del settore gioco mancava un servizio come {name}, dove si fanno incontrare i due attori della filiera — chi cerca e chi offre gioco lecito — garantendo un livello sempre più alto per gli ospiti delle case da gioco, che potranno scegliere, anche attraverso {name}, dove passare il proprio prezioso tempo libero.',
				paragraph3:
					"L'utente potrà consultare tutte le informazioni come ad esempio il numero di macchine, la tipologia di slot machines e VLT, di giochi live, gli orari di apertura, la ristorazione, le scommesse, ecc., i benefit e gli eventi che la sala da gioco ha da offrire.",
				paragraph4:
					'Il proprietario, attraverso {name}, potrà comunicare con potenziali clienti con una semplicità senza precedenti nel settore gioco.',
				paragraph5:
					"{name} è sensibile al gioco responsabile dando una visibilità preferenziale alle case da gioco sicure e con personale qualificato con attestati di frequenza a corsi per contrastare il Gioco d'Azzardo Patologico (GAP)."
			},
			contact: {
				title: 'Contattaci',
				intro:
					'Scrivici a uno dei seguenti indirizzi. Sarà nostra cura risponderti al più presto.',
				info: 'Per informazioni generiche:',
				help:
					'Per ricevere aiuto riguardo la gestione del tuo account, della tua attività o di un abbonamento:',
				report: 'Per segnalare un errore:'
			}
		},

		play_responsibly: {
			meta_title: 'Gioca senza esagerare'
		},

		errors: {
			basic: {
				not_found: 'Pagina non trovata',
				server_error: 'Errore del server',
				back: 'Torna alla pagina principale'
			},
			venue_closed: {
				title: 'Ops!',
				message_1: "Quest'attività non esiste oppure è stata chiusa.",
				message_2: "Dai un'occhiata alle attività adiacenti."
			}
		}
	},

	// Data -------------------------------------------------------------------
	data: {
		subscriptions: {
			default: 'Gratuito',
			silver: 'Silver',
			gold: 'Gold'
		},
		categories: {
			adult_gaming_center: 'Sala giochi per adulti',
			betting_shop: 'Agenzia scommesse',
			bingo: 'Sala bingo',
			family_entertainment_center: 'Intrattenimento per famiglie',
			vlt: 'Sala slot VLT'
		},
		amenities: {
			air_conditioning: 'Aria condizionata',
			atm: 'Totem Bancomat',
			bar: 'Bar',
			pay_per_view: 'Pay per view',
			pos: 'POS',
			private_parking: 'Parcheggio privato',
			private_room: 'Area privè',
			restaurant: 'Ristorante',
			security: 'Servizio di sicurezza',
			smoking_area: 'Area fumatori',
			wifi: 'Wi-Fi'
		}
	}
}
