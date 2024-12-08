#lang racket
(require rackunit)

;;;
;;; MAPCODE PRIMITIVES
;;;

;;; fixed-point? : [F:[X -> X], x:X] -> boolean?
(define fixed-point?
  (lambda (F x)
    (equal? (F x) x)))


;;; mapcode : [init:[A -> X], F:[X -> X], done:[X -> B]] -> B
(define mapcode
  (lambda (init F done) ;; \rho, F, \pi
    (lambda (a)
      (letrec ([loop
                (lambda (x)
                  (if (fixed-point? F x)
                      (done x)
                      (loop (F x))))])
        (loop (init a))))))

;;;
;;; SELECTION SORT PRIMITIVES
;;;

;;; rho find-max
(define rho-find-max
  ;; rho : [(A, b) -> (A, i, m, b)]
  (lambda (a-b)
    (match a-b
      [(list array b) (list array 0 0 b)])))

;;; F find-max
(define F-find-max
  (lambda (state)
    (match state
      ; fixed-point
      [(list array b m b) state]
      ; transient
      [(list array i m b)
       (if (> (list-ref array i) (list-ref array m))
           (list array (add1 i) i b)
           (list array (add1 i) m b))])))

;;; pi find-max
(define pi-find-max
  (lambda (state)
    (match state
      [(list array i m b) m])))

;;; find-max
(define find-max
  (mapcode
   (lambda (a-b) (rho-find-max a-b))
   (lambda (state) (F-find-max state))
   (lambda (state) (pi-find-max state))))

;;; swap
(define swap
  (lambda (array i1 i2)
    (list-set (list-set array i1 (list-ref array i2)) i2 (list-ref array i1))))

;;; rho selection sort
(define rho-selection-sort
  ;; rho : [A -> (A, b)]
  (lambda (array)
    (list array (length array))))

;;; F selection sort
(define F-selection-sort
  (lambda (state)
    (match state
      ; fixed-point
      [(list a (? (<=/c 1) b)) state]
      ; transient
      [(list a b) (let ([m (find-max (list a b))])
                    (list (swap a m (sub1 b)) (sub1 b)))])))

;;; pi selection sort
(define pi-selection-sort
  (lambda (state)
    (match state
      [(list a b) a])))

;;; Selection Sort
(define selection-sort
  (mapcode
   (lambda (array) (rho-selection-sort array))
   (lambda (state) (F-selection-sort state))
   (lambda (state) (pi-selection-sort state))))

;;; Rackunit test cases
(check-equal? (selection-sort (list 1 2 3)) (list 1 2 3) "'(1 2 3)")
(check-equal? (selection-sort (list 3 2 1)) (list 1 2 3) "'(3 2 1)")
(check-equal? (selection-sort (list 1 4 2 3)) (list 1 2 3 4) "'(1 4 2 3)")
(check-equal? (selection-sort (list 3 5 2 13 1 8)) (list 1 2 3 5 8 13) "'(3 5 2 13 1 8)")
(check-equal? (selection-sort (list 30 12 4 33 41 28)) (list 4 12 28 30 33 41) "'(30 12 4 33 41 28)")
