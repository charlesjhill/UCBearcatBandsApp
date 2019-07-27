//
//  InstrumentListVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/23/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class InstrumentListVC: UIViewController  {
    
    let provider = MoyaProvider<InstrumentService>()
    var instruments: [Instrument]? = nil {
        didSet {
            var content: Array<InstrumentCellVC> = []
            if instruments != nil {
                for i in instruments! { content.append(InstrumentCellVC(i)) }
            }
            InstrumentList.content = content
        }
    }
    var selectedInstrument: Instrument? = nil
    
    @IBOutlet weak var ListView: UIView!
    let ListViewContainer = ContainerViewController(content: nil)
    let InstrumentList = ListViewController()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        embedChild(ListViewContainer, in: ListView)
        ListViewContainer.content = InstrumentList
        InstrumentList.listDelegate = self
    }
    
    override func viewDidAppear(_ animated: Bool) {
        provider.request(.showInstruments) { result in
            switch result {
            case let .success(moyaResponse):
                self.instruments = moyaResponse.parseJsonResponse(response: moyaResponse)
            case let .failure(error):
                print(error)
            }
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier {
        case "toInstrumentDetails":
            let vc = segue.destination as! InstrumentDetailsVC
            vc.instrument = selectedInstrument
        default:
            break
        }
    }
    
}

extension InstrumentListVC: ListViewControllerDelegate {

    func listViewController(_ list: ListViewController, didSelect item: UIViewController, at indexPath: IndexPath) -> ListSelectionResponse {
        selectedInstrument = instruments![indexPath.row]
        performSegue(withIdentifier: "toInstrumentDetails", sender: nil)
        return [.deselect]
    }
    
    func listViewController(_ list: ListViewController, swipeConfigurationFor item: UIViewController, at indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        return nil
    }
    
    func listViewController(_ list: ListViewController, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        let instrumentToEdit = instruments![indexPath.row]
        if (editingStyle == .delete) {
            // We'll double check with the user that they actually want to delete things
            let refreshAlert = UIAlertController(title: "Are you sure?",
                                                 message: "You will not be able to recover \(instrumentToEdit.name).",
                                                 preferredStyle: UIAlertController.Style.alert)
            
            refreshAlert.addAction(UIAlertAction(title: "Delete", style: .default, handler: { (action: UIAlertAction!) in
                // Actually perform the deletion
                self.provider.request(.deleteInstrument(id: instrumentToEdit.id)) { result in
                    switch result {
                    case let .success(moyaResponse):
                        if moyaResponse.statusCode == 204 {
                            self.instruments!.remove(at: indexPath.row)
                        }
                    case let .failure(error):
                        print(error)
                    }
                }
            }))
            refreshAlert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
            present(refreshAlert, animated: true, completion: nil)
        }
    }
    
}
