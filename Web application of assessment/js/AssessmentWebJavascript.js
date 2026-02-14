// Global configuration

    // API endpoint
    const LINK_MODEL_URL = "./php/LinkModel.php";

    // Null variables

    // Undefined variables

    // Element variable
    let containeIdVar;
    let containerSubIdVar;


    // Temporary Data Objects
    /*
    dataObj =   {
                    success: true,
                    data:   [
                                {
                                    clientId: 1,
                                    clientName: "African Bank",
                                    clientCode: "ABA001",
                                    contactsQuantity:   2,
                                    unLinkURL: "LinkModel.php?action=unlinkClient&clientId=1",
                                    contactsList:   [
                                                        {
                                                            contactId: 1,
                                                            firstName: "Jabu",
                                                            lastName: "Mamba",
                                                            email: "jabum@gmail.com",
                                                            linksQuantity: 1
                                                        },
                                                        {
                                                            contactId: 2,
                                                            firstName: "Sinethemba",
                                                            lastName: "Maya",
                                                            email: "sinethemba@gmail.com",
                                                            linksQuantity: 1
                                                        }
                                                    ]
                                },
                                {
                                    clientId: 2,
                                    clientName: "CAPITEC",
                                    clientCode: "CAP002",
                                    contactsQuantity:   3,
                                    unLinkURL: "LinkModel.php?action=unlinkClient&clientId=2",
                                    contactsList:   [
                                                        {
                                                            contactId: 3,
                                                            firstName: "Zethu",
                                                            lastName: "Duman",
                                                            email: "zethuduma@gmail.com",
                                                            linksQuantity: 2
                                                        },
                                                        {
                                                            contactId: 4,
                                                            firstName: "Zozo",
                                                            lastName: "Bethu",
                                                            email: "zozombethu@gmail.com",
                                                            linksQuantity: 2
                                                        },
                                                        {
                                                            contactId: 5,
                                                            firstName: "Zingi",
                                                            lastName: "Zonto",
                                                            email: "zinzing@gmail.com",
                                                            linksQuantity: 2                                                          
                                                        }
                                                    ]
                                },
                                {
                                    clientId: 3,
                                    clientName: "FNB",
                                    clientCode: "FNB003",
                                    contactsQuantity:   4,
                                    unLinkURL: "LinkModel.php?action=unlinkClient&clientId=3",
                                    contactsList:   [
                                                        {
                                                            contactId: 3,
                                                            firstName: "Zethu",
                                                            lastName: "Duman",
                                                            email: "zethuduma@gmail.com",
                                                            linksQuantity: 2
                                                        },
                                                        {
                                                            contactId: 4,
                                                            firstName: "Zozo",
                                                            lastName: "Bethu",
                                                            email: "zozombethu@gmail.com",
                                                            linksQuantity: 2
                                                        },
                                                        {
                                                            contactId: 5,
                                                            firstName: "Zingi",
                                                            lastName: "Zonto",
                                                            email: "zinzing@gmail.com",
                                                            linksQuantity: 2                                                          
                                                        },
                                                        {
                                                            contactId: 9,
                                                            firstName: "Jabu",
                                                            lastName: "Tiro",
                                                            email: "jabutiro@gmail.com",
                                                            linksQuantity: 1                                                           
                                                        }
                                                    ]
                                }
                            ]
                }
                */

// Initial loading

    // DOM CONTENT LOADED EVENT LISTENER
    document.addEventListener
    (
        'DOMContentLoaded',
        () =>
        {
            containeIdVar = document.querySelector ( "#ContainerBoard" );
            containerSubIdVar = document.querySelector ( "#ContainerSubBar" );

            document.querySelector ( '#CoveroptionsDisplayButton' ).addEventListener ( 'click', loadClientDataFunc );
            document.querySelector ( '#CoveroptionsAddButton' ).addEventListener ( 'click', addNewClientFunc );
        }
    );

// Data loading

    // Load clients data
    async function loadClientDataFunc ()
    {
        console.log ( "load client data function is called" );

        /* Try statement */
        try
        {
            const response = await fetch(
                `${LINK_MODEL_URL}?action=fetchAll`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            const dataResponse = await response.json();
            
        // const dataResponse = dataObj;
        if ( dataResponse.success )
        {
            
            if ( dataResponse.data.length == 0 )
            {
                // Create Message Text in Container Board

                console.log ( "when success failed" );
                if (  containerSubIdVar )
                {
                    /* Remove Container Sub Bar From Container Board */
                    containeIdVar.removeChild ( containerSubIdVar );
                }
 
                    // Create Container Sub Bar Element
                    const containerSubBarElement = document.createElement ( "div" );
                   containerSubBarElement.id = "ContainerSubBar";
                
                        const containerSubSpanElement = document.createElement ( "span" );
                        containerSubSpanElement.textContent = "No clients found.";
                    // Append to Container Sub Bar Element
                    containerSubBarElement.appendChild ( containerSubSpanElement );

                        const containerSubBreakElement = document.createElement ( "br" );
                    // Append to Container Sub Bar Element
                    containerSubBarElement.appendChild ( containerSubBreakElement );

                        const containerSubTextNode = document.createTextNode ( "The data about clients was not found, we suggest you add a new client to your database to start having clients data." );
                    // Append to Container Sub Bar Element
                    containerSubBarElement.appendChild ( containerSubTextNode );

                // Append to Container Board Element
                containeIdVar.appendChild ( containerSubBarElement );

                containerSubIdVar = document.querySelector ( "#ContainerSubBar" );
            } else {
                createDataTableFunc ( dataResponse.data );
            }
        } else {
            createDisplayMessageFunc ( "Loading data failed", "Something went wrong and loading client data was not successful." );
        }

        } catch ( error )
        {
            createDisplayMessageFunc ( "Loading data failed", "Something went wrong and loading client data was not successful." );
        }
    }

    //

    //

    //

    //

    //

// Table rendering

    // Create data tables
    function createDataTableFunc ( dataParam )
    {
        console.log ( dataParam );

        // Remove container board children element
        if ( !containeIdVar )
        {
            containeIdVar = document.querySelector ("#ContainerBoard" );
        } 

        containeIdVar.replaceChildren ();

        if ( !dataParam )
        {
            createDisplayMessageFunc ( "Data displaying problem", "A problem has occured relating to displaying of client data." );
            return;
        }

        // Build DOM elements in memory

            // Client table container
            const clientTableElement = document.createElement ( "div" );
            clientTableElement.id = "clientTableBar";
            clientTableElement.className = "TableBars";
                // Title bar
                const clientTableTitleBarElement = document.createElement ( 'div' );
                clientTableTitleBarElement.className = "TableTitleBar";
                clientTableTitleBarElement.textContent = "Clients table with " + dataParam.length + " clients"; 
            clientTableElement.appendChild ( clientTableTitleBarElement );
                // Sub container
                const clientTableSubBarElement = document.createElement ( "div" );
                clientTableSubBarElement.className = "TableSubBar";
                    // Header row
                    const clientTableHeaderBarElement  = document.createElement ( 'div' );
                    clientTableHeaderBarElement.className = "TableHeaderBar";
                        // Header: name
                        const clientTableHeaderNameBarElement  = document.createElement ( 'div' );
                        clientTableHeaderNameBarElement.className = "TableHeaderNameBar";
                        clientTableHeaderNameBarElement.textContent = "Name";
                    clientTableHeaderBarElement.appendChild ( clientTableHeaderNameBarElement );
                        // Header: code
                        const clientTableHeaderCodeBarElement  = document.createElement ( 'div' );
                        clientTableHeaderCodeBarElement.className = "TableHeaderCodeBar";
                        clientTableHeaderCodeBarElement.textContent = "Code";
                    clientTableHeaderBarElement.appendChild ( clientTableHeaderCodeBarElement );
                clientTableSubBarElement.appendChild ( clientTableHeaderBarElement );
                    // List container
                    const clientTableListBarElement = document.createElement ( 'div' );
                    clientTableListBarElement.className = "TableListBar";
                clientTableSubBarElement.appendChild ( clientTableListBarElement );
            clientTableElement.appendChild ( clientTableSubBarElement );

                
        const TablesElementsArray = [];
        TablesElementsArray.push( clientTableElement );
        
        // Clients Data Loop
        dataParam.forEach
        (
            ( clientData, index ) =>
            {
                // console.log ( "index:" + index );
                // console.log ( clientData.clientId );
                // console.log ( clientData.clientName );
                // console.log ( clientData.clientCode );
                // console.log ( clientData.contactsQuantity );
                // console.log ( clientData.contactsList );
                // console.log ( clientData.unLinkURL );

                
                            // Ceate Clients Table List Item Anchor Element
                            const clientTableListItemAnchorElement = document.createElement ( "a" );
                            clientTableListItemAnchorElement.href = "#ContactTable" + (clientData.clientId);
                                // Create Clients Table List Item Bar Elmenet
                                const clientTableListItemBarElement = document.createElement ( "div" );
                                clientTableListItemBarElement.className = "ClientTableListItemBar";
                                    // Create Clients Table List Item Name Bar Elmenet
                                    const clientTableListItemNameBarElement = document.createElement ( "div" );
                                    clientTableListItemNameBarElement.className = "ClientTableListItemNameBar";
                                    clientTableListItemNameBarElement.textContent = clientData.clientName;
                                // Append to Clients Table List Item Bar Elmenet
                                clientTableListItemBarElement.appendChild ( clientTableListItemNameBarElement );
                                    // Create Clients Table List Item Code Bar Elmenet
                                    const clientTableListItemCodeBarElement = document.createElement ( "div" );
                                    clientTableListItemCodeBarElement.className = "ClientTableListItemCodeBar";
                                    clientTableListItemCodeBarElement.textContent = clientData.clientCode;
                                // Append to Clients Table List Item Bar Elmenet
                                clientTableListItemBarElement.appendChild ( clientTableListItemCodeBarElement );
                                    // Create Clients Table List Item URL Bar Elmenet
                                    const clientTableListItemURLBarElement = document.createElement ( "div" );
                                    clientTableListItemURLBarElement.className = "ClientTableListItemURLBar";
                                        // Create Clients Table List Item URL Anchor Elmenet
                                        const clientTableListItemURLAnchorElement = document.createElement ( "a" );
                                        clientTableListItemURLAnchorElement.href = clientData.unLinkURL;
                                            // Create Clients Table List Item URL Text Node Elmenet
                                            const clientTableListItemURLTextNode = document.createTextNode ( clientData.unLinkURL );
                                        // Append to Clients Table List Item URL Anchor Elmenet
                                        clientTableListItemURLAnchorElement.appendChild ( clientTableListItemURLTextNode );
                                    // Append to  Clients Table List Item URL Bar Elmenet
                                    clientTableListItemURLBarElement.appendChild ( clientTableListItemURLAnchorElement );
                                // Append to Clients Table List Item Bar Elmenet
                                clientTableListItemBarElement.appendChild ( clientTableListItemURLBarElement );
                            // Append to Ceate Clients Table List Item Anchor Element
                            clientTableListItemAnchorElement.append ( clientTableListItemBarElement );
                        // Append to Client Table List Bar Element
                        clientTableListBarElement.appendChild ( clientTableListItemAnchorElement );

                    // Create Contact Table Bar Element
                    const contactTableBarElement = document.createElement ( "div" );
                    contactTableBarElement.id = "ContactTable" + (clientData.clientId);
                    contactTableBarElement.className = "TableBars";
                        // Create Contact Table Title Bar Element
                        const contactTableTitleBarElement = document.createElement ( "div" );
                        contactTableTitleBarElement.className = "TableTitleBar";
                        contactTableTitleBarElement.textContent = clientData.clientName + "'s table with " + clientData.contactsQuantity + " contacts";
                    // Append to Contact Table Bar Element
                    contactTableBarElement.appendChild ( contactTableTitleBarElement );
                        // Create contact Table Sub Bar Element
                        const contactTableSubBarElement = document.createElement ( "div" );
                        contactTableSubBarElement.className = "TableSubBar";
                            // Create Contact Table Header Bar Element
                            const contactTableHeaderBarElement = document.createElement ( "div" );
                            contactTableHeaderBarElement.className = "TableHeaderBar";
                               // Create Contact Table Header Email Bar Element
                                const contactTableHeaderSurnameBarElement = document.createElement ( "div" );
                                contactTableHeaderSurnameBarElement.className = "TableHeaderSurnameBar";
                                contactTableHeaderSurnameBarElement.textContent = "Surname";
                            // Append to Contact Table Header Bar Element
                            contactTableHeaderBarElement.appendChild ( contactTableHeaderSurnameBarElement );
                                // Create Contact Table Header Name Bar Element
                                const contactTableHeaderNameBarElement = document.createElement ( "div" );
                                contactTableHeaderNameBarElement.className = "TableHeaderNameBar";
                                contactTableHeaderNameBarElement.textContent = "Name";
                            // Append to Contact Table Header Bar Element
                            contactTableHeaderBarElement.appendChild ( contactTableHeaderNameBarElement );
                                // Create Contact Table Header Remove Bar Element
                                const contactTableHeaderEmailBarElement = document.createElement ( "div" );
                                contactTableHeaderEmailBarElement.className = "TableHeaderEmailBar";
                                contactTableHeaderEmailBarElement.textContent = "Email";
                            // Append to Contact Table Header Bar Element
                            contactTableHeaderBarElement.appendChild ( contactTableHeaderEmailBarElement );
                        // Append to contact Table Sub Bar Element
                        contactTableSubBarElement.appendChild ( contactTableHeaderBarElement );
                            // Create Contact Table List Bar Element
                            const contactTableListBarElement = document.createElement ( "div" );
                            contactTableListBarElement.className = "TableListBar";

                    if ( clientData.contactsQuantity > 0 && clientData.contactsList.length > 0 )
                    {
                        clientData.contactsList.forEach
                        (
                            ( contact, contactIndex ) =>
                            {
                                // console.log ( contact );
                                
                                // Create Contact Table List Item Bar Element
                                const contactTableListItemBarElement = document.createElement ( "div" );
                                contactTableListItemBarElement.className = "TableListItemBar";
                                    // Create Contact Table List Item Bar Element
                                    const contactTableListItemSurnameBarElement = document.createElement ( "div" );
                                    contactTableListItemSurnameBarElement.className = "TableListItemSurnameBar";
                                    contactTableListItemSurnameBarElement.textContent = contact.lastName;
                                //Append to Contact Table List Item Bar Element
                                contactTableListItemBarElement.appendChild ( contactTableListItemSurnameBarElement );
                                    // Create Contact Table List Item Bar Element
                                    const contactTableListItemNameBarElement = document.createElement ( "div" );
                                    contactTableListItemNameBarElement.className = "TableListItemNameBar";
                                    contactTableListItemNameBarElement.textContent = contact.firstName;
                                //Append to Contact Table List Item Bar Element
                                contactTableListItemBarElement.appendChild ( contactTableListItemNameBarElement );
                                    // Create Contact Table List Item Bar Element
                                    const contactTableListItemEmailBarElement = document.createElement ( "div" );
                                    contactTableListItemEmailBarElement.className = "TableListItemEmailBar";
                                    contactTableListItemEmailBarElement.textContent = contact.email;
                                //Append to Contact Table List Item Bar Element
                                contactTableListItemBarElement.appendChild ( contactTableListItemEmailBarElement );
                                    // Create Contact Table List Item Bar Element
                                    const contactTableListItemLinksBarElement = document.createElement ( "div" );
                                    contactTableListItemLinksBarElement.className = "TableListItemLinkBar";
                                    linksText = "links";
                                    if ( contact.linksQuantity == 1 ){ linksText = "link"; }
                                    contactTableListItemLinksBarElement.textContent = contact.linksQuantity + " " + linksText;
                                // Append to Contact Table List Item Bar Element
                                contactTableListItemBarElement.appendChild ( contactTableListItemLinksBarElement );
                            // Append to Contact Table List Bar Element
                            contactTableListBarElement.appendChild ( contactTableListItemBarElement );
                            }
                        );
                    } else {
                            // Create contact Table List Item Bar Element
                            const contactTableListItemBarElement = document.createElement ( "div" );
                            contactTableListItemBarElement.className = "TableListItemBar";
                            contactTableListItemBarElement.textContent = "No contact Found";
                        // Append to contact Table List Bar Element
                        contactTableListBarElement.appendChild ( contactTableListItemBarElement );
                    }

                        // Append to contact Table Sub Bar Element
                        contactTableSubBarElement.appendChild ( contactTableListBarElement );
                            // Create Contact Table Button Bar Element
                            const contactTableButtonBarElement = document.createElement ( "div" );
                            contactTableButtonBarElement.className = "TableButtonBar";
                                // Create Contact Table Button Element
                                const contactTableButtonElement = document.createElement ( "button" );
                                contactTableButtonElement.textContent = "Add new client";
                                contactTableButtonElement.addEventListener
                                (
                                    'click',
                                    () =>
                                    {
                                        addNewContactFunc ( clientData.clientId, clientData.clientName );
                                    }
                                );
                            // Append to Contact Table Button Bar
                            contactTableButtonBarElement.appendChild ( contactTableButtonElement );
                        // Append to contact Table Sub Bar Element
                        contactTableSubBarElement.appendChild ( contactTableButtonBarElement );
                    // append to Contact Table Bar Element
                    contactTableBarElement.appendChild ( contactTableSubBarElement );

                // Ad Contact Table Bar Element to Tables Element Array
                // So it wouldn't make the DOM slow
                TablesElementsArray.push( contactTableBarElement );
            }
        )
        ;

        if ( TablesElementsArray.length > 0 )
        {
                // console.log ( "Just need to check if the last index activates this session" );
                
                // Check if container board exists
                if ( !containeIdVar )
                {
                    containeIdVar = document.querySelector ( "#ContainerBoard" );
                }

                TablesElementsArray.forEach
                (
                    ( element, index ) =>
                    {
                        containeIdVar.appendChild ( TablesElementsArray[ index ] );
                    }
                );
        }

    }

    //

    //

// Popups

    // Create external board
    function createExternalBoardFun ( titleParam )
    {
        // Create External Board
            const externalBoared = document.createElement ( "div" );
            externalBoared.className = "ExternalBoard";

                // Create External Close Bar
                const externalCloseBar = document.createElement ( "div" );
                externalCloseBar.className = "ExternalCloseBar";
                    // Create External Timmer Text
                    const externalTimmerText = document.createElement ( "p" );
                    externalTimmerText.textContent = "25s";
                    
                    // TIMER INTERVAL
                    let timerCount = 25;
                    externalTimmerText.textContent = timerCount + 's';
                    const timerInterval = setInterval ( () =>
                    {
                        timerCount--;
                        externalTimmerText.textContent = timerCount + 's';

                        if ( timerCount <= 0 )
                        {
                            clearInterval ( timerInterval );
                            // close the external board when timer finishes
                            closeExternalBoardFunc();
                        }
                    }, 1000 );
                // Append to External Close Bar
                externalCloseBar.appendChild ( externalTimmerText );
                    // Create External close button
                    const externalCloseButton = document.createElement ( "button" );
                    externalCloseButton.className = "ExternalCloseButton";
                    externalCloseButton.textContent = "Close";
                // Append to External Close Bar
                externalCloseBar.appendChild ( externalCloseButton );
            // Append to External Board
            externalBoared.appendChild ( externalCloseBar );

                // Create External Sub Bar
                const externalSubBar = document.createElement ( "div" );
                externalSubBar.className = "ExternalSubBar";
                    // Create External Title Bar
                    const externalTitleBar = document.createElement ( "div" );
                    externalTitleBar.className = "ExternalTitleBar";
                    externalTitleBar.textContent = titleParam;
                // Append to Exernal Sub Bar
                externalSubBar.appendChild ( externalTitleBar );
            // Append to External Board
            externalBoared.appendChild ( externalSubBar );
        // Append to body element
        document.body.appendChild (externalBoared  );

        externalCloseButton.addEventListener ( 'click', () => { clearInterval ( timerInterval ); closeExternalBoardFunc(); } );



        return externalSubBar;
    }

    // Add client
    async function addNewClientFunc ()
    {
        //console.log ( "the add new client function is called" );

        // Call close all external board function
        closeExternalBoardFunc ();

        // Create External Bar and External Sub Bar Elements by calling Create External Board Function
        const externalSubBarElement = createExternalBoardFun ( "Add a new client" );

            // Create Add New Client Details Bar
            const externalDetailsBar = document.createElement ( "div" );
            externalDetailsBar.className = "ExternalDetailsBar";
            externalDetailsBar.textContent = "Enter the full name of the client";
        // Append to External Sub Bar Element
        externalSubBarElement.appendChild ( externalDetailsBar );
        // Create Add New Client Input Bar
            const externalInputBar = document.createElement ( "div" );
            externalInputBar.className = "ExternalInputBar";
                // Create External Input Element
                const externalInputElement = document.createElement ( "input" );
                externalInputElement.type = "text";
                externalInputElement.name = "clientname";
                externalInputElement.placeholder = "Client name";
            // Append to External Input Bar
            externalInputBar.appendChild ( externalInputElement );
        // Append to External Sub Bar Element
        externalSubBarElement.appendChild ( externalInputBar );
        // Create Add New Client options Bar
            const externalOptionsBar = document.createElement ( "div" );
            externalOptionsBar.className = "ExternaloptionsBar";
                // Create Add New Client options Add Button
                const externalOptionsAddButton = document.createElement ( "button" );
                externalOptionsAddButton.className = "ExternaloptionsAddButton";
                externalOptionsAddButton.textContent = "Add client";
            // Append to Add New Client options Bar
            externalOptionsBar.appendChild ( externalOptionsAddButton );
                // Create Add New Client options Close Button
                const externalOptionsCloseButton = document.createElement ( "button" );
                externalOptionsCloseButton.className = "ExternaloptionsCloseButton";
                externalOptionsCloseButton.textContent = "Cancel";
            // Append to Add New Client options Bar
            externalOptionsBar.appendChild ( externalOptionsCloseButton );
        // Append to External Sub Bar Element
        externalSubBarElement.appendChild ( externalOptionsBar );

        externalOptionsAddButton.addEventListener
        (
            'click',
            async () =>
            {
                // Get value of client name
                const  clientNameValue = externalInputElement.value;
                const nameValidResult = nameValidationFunction ( clientNameValue, 'client' );

                //console.log ( "client name: " + clientNameValue );
                //console.log ( "name valid result: " + nameValidResult );

                if ( nameValidResult )
                {
                    console.log ( "client name was successful" );

                    try
                    {
                        const formData = new FormData ();
                        formData.append ( 'action', 'addClient' );
                        formData.append ( 'clientName', clientNameValue );

                        const response = await fetch(
                            LINK_MODEL_URL,
                            {
                                method: 'POST',
                                body: formData
                            }
                        );

                        const responseData = await response.json();

                        if ( responseData.success )
                        {
                            loadClientDataFunc ();
                        } else 
                        {
                            createDisplayMessageFunc ( "Failed to add new client", "Something went wrong while adding a new client, try again later." );
                        }


                    } catch ( error )
                    {
                        createDisplayMessageFunc ( "Failed to add client", "Something went wrong while trying to add a new client, Try again later." );
                    }
                }
            }
        );
        externalOptionsCloseButton.addEventListener ( 'click', closeExternalBoardFunc );

    }

    // Add contact
    function addNewContactFunc ( clientIdParam, clientNameParam )
    {
        //console.log ( "the add new contact function was called" );

        // Call close all external board function
        closeExternalBoardFunc ();

        // Create External Bar and External Sub Bar Elements by calling Create External Board Function
        const externalSubBarElement = createExternalBoardFun ( "Add a new contact" );

            // External Details Element
            const externalDetailsElement = document.createElement ( "div" );
            externalDetailsElement.className = "ExternalDetailsBar";
            externalDetailsElement.textContent = "Add a new contact for " + clientNameParam;
            externalDetailsElement.style.fontWeight = "bold";
        // Append to External Sub Bar Element
        externalSubBarElement.appendChild ( externalDetailsElement );
            // External Details Name Element
            const externalNameDetailsElement = document.createElement ( "div" );
            externalNameDetailsElement.className = "ExternalDetailsBar";
            externalNameDetailsElement.textContent = "Enter contact first name ";
        // Append to External Sub Bar Element
        externalSubBarElement.appendChild ( externalNameDetailsElement );
            //  Create External Input Name Element
            const externalNameInputBarElement = document.createElement ( "div" );
            externalNameInputBarElement.className = "ExternalInputBar";
                // Create External Name Input Element
                const externalNameInputElement = document.createElement ( "input" );
                externalNameInputElement.type = "text";
                externalNameInputElement.name = "contactname";
                externalNameInputElement.placeholder = "Contact first name";
            // Append to External Input Bar
            externalNameInputBarElement.appendChild ( externalNameInputElement );
        // Append to External Sub Bar Element
        externalSubBarElement.appendChild ( externalNameInputBarElement );
            // Create External Last Name Details Element
            const externalLastNameDetailsElement = document.createElement ( "div" );
            externalLastNameDetailsElement.className = "ExternalDetailsBar";
            externalLastNameDetailsElement.textContent = "Enter contact last name";
        // Append to External Sub Bar Element
        externalSubBarElement.appendChild ( externalLastNameDetailsElement );
            // Create External Last Name Input Bar Element
            const externalLastNameInputBarElement = document.createElement ( "div" );
            externalLastNameInputBarElement.className = "ExternalInputBar";
                // Create External Last Name Input Element
                const externalLastNameInputElement = document.createElement ( "input" );
                externalLastNameInputElement.type = "text";
                externalLastNameInputElement.name = "contactlastname";
                externalLastNameInputElement.placeholder = "Contact last name";
            // Append to External Last Name Input Bar Element
            externalLastNameInputBarElement.appendChild ( externalLastNameInputElement );
        // Append to External Sub Bar Element
        externalSubBarElement.appendChild ( externalLastNameInputBarElement );
            // Create External Email Details Element
            const externalEmailDetailsElement = document.createElement ( "div" );
            externalEmailDetailsElement.className = "ExternalDetailsBar";
            externalEmailDetailsElement.textContent = "Enter contact email";
        // Append to External Sub Bar Element
        externalSubBarElement.appendChild ( externalEmailDetailsElement );
            // Create External Email Input Bar Element
            const externalEmailInputBarElement = document.createElement ( "div" );
            externalEmailInputBarElement.className = "ExternalInputBar";
                // Create external Email Input Element
                const externalEmailInputElement = document.createElement ( "input" );
                externalEmailInputElement.type = "email";
                externalEmailInputElement.name = "contactemail";
                externalEmailInputElement.placeholder = "contact email";
            // Append to External Email Input Element
            externalEmailInputBarElement.appendChild ( externalEmailInputElement );
        // Append to External Sub Bar Element
        externalSubBarElement.appendChild ( externalEmailInputBarElement );
            // Create Add New Client options Bar
            const externalOptionsBar = document.createElement ( "div" );
            externalOptionsBar.className = "ExternaloptionsBar";
                // Create Add New Client options Add Button
                const externalOptionsAddButton = document.createElement ( "button" );
                externalOptionsAddButton.className = "ExternaloptionsAddButton";
                externalOptionsAddButton.textContent = "Add content";
            // Append to Add New Client options Bar
            externalOptionsBar.appendChild ( externalOptionsAddButton );
                // Create Add New Client options Close Button
                const externalOptionsCloseButton = document.createElement ( "button" );
                externalOptionsCloseButton.className = "ExternaloptionsCloseButton";
                externalOptionsCloseButton.textContent = "Cancel";
            // Append to Add New Client options Bar
            externalOptionsBar.appendChild ( externalOptionsCloseButton );
        // Append to External Sub Bar Element
        externalSubBarElement.appendChild ( externalOptionsBar );

                externalOptionsAddButton.addEventListener
                (
                    'click',
                    async () =>
                    {
                        // Get Input value for Contact Name
                        const contactFirstNameValue = externalNameInputElement.value;
                        const firstNameValidResult = nameValidationFunction ( contactFirstNameValue, 'contact', 'first' );

                        // Get Input value for Contact Last Name
                        const contactLastNameValue = externalLastNameInputElement.value;
                        const lastNameValidResult =  nameValidationFunction ( contactLastNameValue, 'contact', 'last' );
                    
                        // Get Input value for Contact Email
                        const contactEmailValue = externalEmailInputElement.value;
                        const emailValidResult = emailValidationFunction ( contactEmailValue, 'contact' );

                        //console.log ( "contact name: " + contactNameValue + ", contact emal: " + contactEmailValue );
                        //console.log ( "name valid result: " + nameValidResult + " , email valid result: " + emailValidResult );

                        if ( firstNameValidResult && lastNameValidResult && emailValidResult )
                        {
                            console.log ( "contact first name, last name and email were successful" );
                        
                            try
                            {
                                const formData = new FormData ();
                                formData.append('action', 'addContact');
                                formData.append('clientId', clientIdParam);
                                formData.append('firstName', contactFirstNameValue);
                                formData.append('lastName', contactLastNameValue);
                                formData.append('email', contactEmailValue);

                                const response = await fetch(
                                    LINK_MODEL_URL,
                                    {
                                        method: 'POST',
                                        body: formData
                                    }
                                );

                                const responseData = await response.json();

                                if ( responseData.success )
                                {
                                    loadClientDataFunc ();
                                } else {
                                    createDisplayMessageFunc ( "Failed to add contact to " + clientNameParam, "Something went wrong while trying to add new contact for " + clientNameParam + " , Try again later." );                                    
                                }
                            } catch {
                                createDisplayMessageFunc ( "Failed to add contact to " + clientNameParam, "Something went wrong while trying to add new contact for " + clientNameParam + " , Try again later." );
                            }
                        }
                    }
                );
                externalOptionsCloseButton.addEventListener ( 'click', closeExternalBoardFunc );
    }

    //

    //

    // Display message
    function createDisplayMessageFunc ( titleParam, detailsParam )
    {
        //console.log ( "the Display message function is called" );

        // Call close all external board function
        closeExternalBoardFunc ();

        // Create External Bar and External Sub Bar Elements by calling Create External Board Function
        const externalSubBarElement = createExternalBoardFun ( titleParam );

            //  Create External Details Bar Element
            const externalDetailsBarElement = document.createElement ( "div" );
            externalDetailsBarElement.className = "ExternalDetailsBar";
            externalDetailsBarElement.textContent = detailsParam;
        // Append to Extenal Sub Bar Element
        externalSubBarElement.appendChild ( externalDetailsBarElement );
            //  Create External Options Bar Element
            const externalOptionsBarElement = document.createElement ( "div" );
            externalOptionsBarElement.className = "ExternaloptionsBar";
                // Create External Options Close Button Element
                const externalOptionsCloseButtonElement = document.createElement ( "button" );
                externalOptionsCloseButtonElement.className = "ExternaloptionsCloseButton";
                externalOptionsCloseButtonElement.textContent = "close";
            // Append to External Options Bar Element
            externalOptionsBarElement.appendChild ( externalOptionsCloseButtonElement );
        // Append to Extenal Sub Bar Element
        externalSubBarElement.appendChild ( externalOptionsBarElement );

                externalOptionsCloseButtonElement.addEventListener
                (
                    'click',
                    closeExternalBoardFunc
                );
    }


    // Close external board
    function closeExternalBoardFunc ()
    {
        //console.log ( 'Close External Board Function was called' );

        const externalBoardIdArray = document.querySelectorAll ( '.ExternalBoard' );
        if ( externalBoardIdArray != undefined && externalBoardIdArray.length > 0 )
        {
            externalBoardIdArray.forEach
            (
                ( element ) =>
                {
                    document.body.removeChild ( element );
                }
            );
        }                
    }

// Validation

    // Name validation
    function nameValidationFunction ( nameParam, formType, nameTpye = null )
    {
        let passValue = true;

        let titleValue = formType;
        if ( nameParam != null )
        {
            titleValue = formType + " " + nameTpye;
        }


        if ( !nameParam ) { passValue = false; createDisplayMessageFunc ( 'Name error', 'Please enter the ' + titleValue + ' name.' ); }
        if ( nameParam && nameParam.length < 3 ){ passValue = false; createDisplayMessageFunc ( 'Name error', 'Please enter a ' + titleValue + ' name that is three(3) or more letters, (e.g, ABCD).' ); }
        if ( nameParam && !/[A-Z]/.test( nameParam ) ){ passValue = false; createDisplayMessageFunc ( 'Name error', 'Please enter a ' + titleValue + ' name with uppercase letters, (e.g, ABC).' ); }
        if ( nameParam && /\d/.test( nameParam ) ){ passValue = false; createDisplayMessageFunc ( 'Name error', 'Please enter a ' + titleValue + ' name without numerical values.' ); }

        return passValue;
    }

    // Email validation
    function emailValidationFunction ( emailParam, formType )
    {
        let passValue = true;
        
        if ( !emailParam ){ passValue = false; createDisplayMessageFunc ( 'Email error', 'Please enter the ' + formType + ' email.' ); }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ( emailParam && !emailRegex.test( emailParam ) )
        { passValue = false; createDisplayMessageFunc ( 'Email error', 'Please enter a valid ' + formType + ' email (e.g, user@example.com).' ); }

        return passValue;
    }